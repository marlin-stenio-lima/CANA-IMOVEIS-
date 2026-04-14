const fs = require('fs');
// This script will output all DROP POLICY statements for tasks and appointments
const tables = ['tasks', 'appointments'];
let sql = "";
for (const table of tables) {
    sql += `-- Drop all possible policies on public.${table}\n`;
    sql += `DO $$\nDECLARE\n    pol record;\nBEGIN\n    FOR pol IN \n        SELECT policyname \n        FROM pg_policies \n        WHERE schemaname = 'public' \n        AND tablename = '${table}'\n    LOOP\n        EXECUTE format('DROP POLICY IF EXISTS %I ON public.${table}', pol.policyname);\n    END LOOP;\nEND\n$$;\n\n`;
}

sql += `
-- AGORA CRIAR APENAS AS POLÍTICAS PERFEITAS

CREATE POLICY "Enable all for tasks" ON public.tasks FOR ALL USING (true) WITH CHECK(true);
CREATE POLICY "Enable all for appointments" ON public.appointments FOR ALL USING (true) WITH CHECK(true);
`;

fs.writeFileSync('CLEANUP_POLICIES.sql', sql);
console.log("SQL generated!");
