const express = require('express');
const supabase = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3211;

const SUPABASE_URL = "https://mhybmdupxnqlcqwucxep.supabase.co";
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeWJtZHVweG5xbGNxd3VjeGVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzY5MzA0NywiZXhwIjoyMDM5MjY5MDQ3fQ.NtupslAU2alPWSNcd38bX9zpwmbababGViJlBx_SfWs";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
app.use(cors());

app.get("/", async (req, res) => {
    try {
        const { data: posts, error } = await db.from("post").select();
        if (error) throw error;
        res.json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Error fetching posts" });
    }
});

app.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;
        const { data: newPost, error } = await db.from("post").insert({ title, description });
        if (error) throw error;
        res.status(201).json({ newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Error creating post" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
