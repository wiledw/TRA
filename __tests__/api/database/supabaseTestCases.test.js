const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

 
describe('Supabase Connection', () => {
    test('Establish connection and fetch data', async () => {
        const { data, error } = await supabase.from('posts').select('*').limit(1);
    
        expect(error).toBeNull();
        expect(Array.isArray(data)).toBeTruthy();
        if (data.length > 0) {
            expect(data[0]).toHaveProperty('id');
        }
    });
});