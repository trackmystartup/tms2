# 404 NOT_FOUND Error Troubleshooting Guide

## 🔍 Understanding the Error

**Error Format:**
```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::6xjxz-1763059733594-73c8b94c22ec
```

- **404**: HTTP status code (Not Found)
- **NOT_FOUND**: Supabase error code
- **bom1**: Supabase region identifier (Mumbai/Bombay region)
- **ID**: Unique error identifier for debugging

## 🎯 Common Causes & Solutions

### 1. **Missing RPC Function** (Most Common)

**Problem:** Your code calls an RPC function that doesn't exist in the database.

**How to Identify:**
- Check browser console for the exact function name
- Look for `.rpc('function_name', ...)` calls in your code

**Solution:**
1. Check if the function exists in Supabase:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name = 'your_function_name';
   ```

2. If missing, create the function or use an alternative approach:
   - Replace RPC calls with direct table queries
   - Create the missing function in Supabase SQL Editor

**Example Fix:**
```typescript
// Before (causing 404)
const { data, error } = await supabase
  .rpc('get_startup_profile', { startup_id: id });

// After (using direct query)
const { data, error } = await supabase
  .from('startups')
  .select('*')
  .eq('id', id)
  .single();
```

### 2. **Table Doesn't Exist**

**Problem:** Querying a table that hasn't been created in Supabase.

**How to Identify:**
- Check the error message for table name
- Look for `.from('table_name')` in your code

**Solution:**
1. Verify table exists:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'your_table_name';
   ```

2. Create the table if missing or fix the table name in your code.

### 3. **Using `.single()` on Empty Results**

**Problem:** Using `.single()` when no rows match the query.

**How to Identify:**
- Error occurs with `.single()` calls
- Query returns no results

**Solution:**
```typescript
// Before (causes 406/404 if no results)
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('id', id)
  .single();

// After (handles empty results gracefully)
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('id', id);

if (error) {
  console.error('Error:', error);
  return null;
}

if (!data || data.length === 0) {
  return null; // No record found
}

return data[0]; // Return first result
```

### 4. **Storage Bucket/File Not Found**

**Problem:** Trying to access a file or bucket that doesn't exist.

**How to Identify:**
- Error occurs with `storage.from('bucket').download()` or similar
- Check if bucket exists in Supabase Storage

**Solution:**
1. Verify bucket exists in Supabase Dashboard → Storage
2. Check file path is correct
3. Ensure RLS policies allow access

### 5. **Wrong API Endpoint**

**Problem:** Using incorrect Supabase URL or endpoint.

**Solution:**
- Verify `VITE_SUPABASE_URL` in your `.env.local` file
- Check the URL format: `https://your-project.supabase.co`

## 🔧 Diagnostic Steps

### Step 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for the exact error with stack trace
4. Note which file/function is calling the failing operation

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Find the failed request (status 404)
4. Check the Request URL to see what's being called
5. Check Response for more details

### Step 3: Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Logs → API Logs
3. Find the error by timestamp or error ID
4. Check the exact endpoint that failed

### Step 4: Verify Database Objects
Run these queries in Supabase SQL Editor:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check all RPC functions
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Check storage buckets
SELECT name, public 
FROM storage.buckets;
```

## 🛠️ Quick Fixes

### Fix 1: Add Error Handling
```typescript
try {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      console.log('No record found');
      return null;
    }
    console.error('Supabase error:', error);
    throw error;
  }
  
  return data;
} catch (err) {
  console.error('Error:', err);
  return null;
}
```

### Fix 2: Replace Missing RPC with Direct Query
If an RPC function is missing, replace it with a direct query:

```typescript
// Instead of RPC
const { data, error } = await supabase
  .rpc('missing_function', { param: value });

// Use direct query
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('filter_column', value);
```

### Fix 3: Check Environment Variables
Ensure your `.env.local` has correct values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📋 Common Missing Functions

Based on your codebase, these functions might be missing:

1. `get_recommended_co_investment_opportunities`
2. `get_startup_profile`
3. `get_startup_profile_simple`
4. `safe_update_diligence_status`
5. `get_user_investment_offers`

**Solution:** Check `CREATE_MISSING_RPC_FUNCTIONS.sql` or `FIX_MISSING_RPC_FUNCTIONS.sql` files.

## 🎯 Next Steps

1. **Identify the exact failing operation** from browser console
2. **Check if the table/function exists** in Supabase
3. **Apply the appropriate fix** from above
4. **Test the fix** and verify error is resolved

## 📞 Need More Help?

If you can share:
- The exact error message from console
- The file/function where error occurs
- The Supabase operation being performed

I can provide a more specific solution!

