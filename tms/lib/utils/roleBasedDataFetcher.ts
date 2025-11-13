// Role-based data fetching - only fetch what each role needs
import { UserRole } from '../../types';
import { startupService, investmentService, userService, verificationService } from '../database';
import { validationService } from '../validationService';
import { caService } from '../caService';
import { csService } from '../csService';
import { withRetry } from './errorHandler';

export interface RoleDataRequirements {
  needsStartups: boolean;
  needsInvestments: boolean;
  needsRequests: boolean;
  needsUsers: boolean;
  needsVerifications: boolean;
  needsOffers: boolean;
  needsValidations: boolean;
  needsRelationships: boolean;
}

const ROLE_REQUIREMENTS: Record<UserRole, RoleDataRequirements> = {
  'Admin': {
    needsStartups: true,
    needsInvestments: true,
    needsRequests: true,
    needsUsers: true,
    needsVerifications: true,
    needsOffers: true,
    needsValidations: true,
    needsRelationships: false,
  },
  'Investor': {
    needsStartups: true,
    needsInvestments: false,
    needsRequests: true, // For approved requests
    needsUsers: false,
    needsVerifications: false,
    needsOffers: true,
    needsValidations: false,
    needsRelationships: false,
  },
  'Startup': {
    needsStartups: true,
    needsInvestments: false,
    needsRequests: false,
    needsUsers: false,
    needsVerifications: false,
    needsOffers: true, // Their own offers
    needsValidations: false,
    needsRelationships: false,
  },
  'Investment Advisor': {
    needsStartups: true,
    needsInvestments: false,
    needsRequests: false,
    needsUsers: false,
    needsVerifications: false,
    needsOffers: false,
    needsValidations: false,
    needsRelationships: true,
  },
  'CA': {
    needsStartups: true,
    needsInvestments: false,
    needsRequests: false,
    needsUsers: false,
    needsVerifications: false,
    needsOffers: false,
    needsValidations: false,
    needsRelationships: false,
  },
  'CS': {
    needsStartups: true,
    needsInvestments: false,
    needsRequests: false,
    needsUsers: false,
    needsVerifications: false,
    needsOffers: false,
    needsValidations: false,
    needsRelationships: false,
  },
  'Startup Facilitation Center': {
    needsStartups: true,
    needsInvestments: false,
    needsRequests: false,
    needsUsers: false,
    needsVerifications: false,
    needsOffers: false,
    needsValidations: false,
    needsRelationships: false,
  },
};

export function getRoleRequirements(role: UserRole): RoleDataRequirements {
  return ROLE_REQUIREMENTS[role] || ROLE_REQUIREMENTS['Investor'];
}

export interface FetchDataOptions {
  role: UserRole;
  userId: string;
  email?: string;
  investorCode?: string;
  selectedStartupId?: number;
  forceRefresh?: boolean;
}

export async function fetchRoleBasedData(options: FetchDataOptions) {
  const { role, userId, email, investorCode, selectedStartupId, forceRefresh = false } = options;
  const requirements = getRoleRequirements(role);
  
  const promises: Promise<any>[] = [];
  const promiseKeys: string[] = [];

  // Startups - always needed but method varies by role
  if (requirements.needsStartups) {
    if (role === 'Startup' && selectedStartupId) {
      promises.push(Promise.resolve([{ id: selectedStartupId }]));
      promiseKeys.push('startups');
    } else if (role === 'Admin') {
      promises.push(withRetry(() => startupService.getAllStartupsForAdmin()));
      promiseKeys.push('startups');
    } else if (role === 'Investment Advisor') {
      promises.push(withRetry(() => startupService.getAllStartupsForInvestmentAdvisor()));
      promiseKeys.push('startups');
    } else if (role === 'CA') {
      promises.push(
        withRetry(() => caService.getAssignedStartups()).then(startups =>
          startups.map((s: any) => ({
            id: s.id,
            name: s.name,
            investmentType: 'Seed' as any,
            investmentValue: s.totalFunding || 0,
            equityAllocation: 0,
            currentValuation: s.totalFunding || 0,
            complianceStatus: s.complianceStatus,
            sector: s.sector,
            totalFunding: s.totalFunding,
            totalRevenue: s.totalRevenue,
            registrationDate: s.registrationDate,
            founders: []
          }))
        )
      );
      promiseKeys.push('startups');
    } else if (role === 'CS') {
      promises.push(
        withRetry(() => csService.getAssignedStartups()).then(startups =>
          startups.map((s: any) => ({
            id: s.id,
            name: s.name,
            investmentType: 'Seed' as any,
            investmentValue: s.totalFunding || 0,
            equityAllocation: 0,
            currentValuation: s.totalFunding || 0,
            complianceStatus: s.complianceStatus,
            sector: s.sector,
            totalFunding: s.totalFunding,
            totalRevenue: s.totalRevenue,
            registrationDate: s.registrationDate,
            founders: []
          }))
        )
      );
      promiseKeys.push('startups');
    } else {
      promises.push(withRetry(() => startupService.getAllStartups()));
      promiseKeys.push('startups');
    }
  }

  // Investments - only for Admin
  if (requirements.needsInvestments) {
    promises.push(withRetry(() => investmentService.getNewInvestments()));
    promiseKeys.push('investments');
  }

  // Requests - for Admin and Investor
  if (requirements.needsRequests) {
    promises.push(withRetry(() => userService.getStartupAdditionRequests()));
    promiseKeys.push('requests');
  }

  // Users - only for Admin
  if (requirements.needsUsers) {
    promises.push(withRetry(() => userService.getAllUsers()));
    promiseKeys.push('users');
  }

  // Verifications - only for Admin
  if (requirements.needsVerifications) {
    promises.push(withRetry(() => verificationService.getVerificationRequests()));
    promiseKeys.push('verifications');
  }

  // Offers - for Admin, Investor, and Startup
  if (requirements.needsOffers) {
    if (role === 'Investor' && email) {
      promises.push(withRetry(() => investmentService.getUserInvestmentOffers(email)));
      promiseKeys.push('offers');
    } else if (role === 'Admin') {
      promises.push(withRetry(() => investmentService.getAllInvestmentOffers()));
      promiseKeys.push('offers');
    } else if (role === 'Startup' && selectedStartupId) {
      promises.push(withRetry(() => investmentService.getOffersForStartup(selectedStartupId)));
      promiseKeys.push('offers');
    } else {
      promises.push(Promise.resolve([]));
      promiseKeys.push('offers');
    }
  }

  // Validations - only for Admin
  if (requirements.needsValidations) {
    promises.push(withRetry(() => validationService.getAllValidationRequests()));
    promiseKeys.push('validations');
  }

  // Relationships - only for Investment Advisor
  if (requirements.needsRelationships && role === 'Investment Advisor' && userId) {
    promises.push(
      withRetry(() => investmentService.getPendingInvestmentAdvisorRelationships(userId))
    );
    promiseKeys.push('relationships');
  }

  // Execute all required fetches in parallel
  const results = await Promise.allSettled(promises);
  
  // Map results back to keys
  const data: Record<string, any> = {};
  promiseKeys.forEach((key, index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      data[key] = result.value;
    } else {
      data[key] = [];
    }
  });

  return data;
}

