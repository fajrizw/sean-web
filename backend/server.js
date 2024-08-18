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

app.get("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data: post, error } = await db.from("post").select().eq("id", id);
        if (error) throw error;
        if (post.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json({ post: post[0] });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Error fetching post" });
    }
});
app.put("/update/:id", async (req, res) => {
    try {
        const {id} = req.params
        const {title, description} = req.body
       

      // Validate input
      if (!id || !title || !description) {
        console.error("Invalid input:", { id, title, description });
        return res.status(400).json({ error: "Invalid input" });
    }
    console.log("Update request received with:", { id, title, description });
        const {data: updatePost, error} = await db.from("post").update({title, description}).eq("id", id).select()
        if (error) {
            console.error("Database error:", error);
            throw error;
        }

        if (updatePost.length === 0) {
            console.error("No post found with ID:", id);
            return res.status(404).json({ error: "Post not found" });
        }

        console.log("Updated post:", updatePost);
        res.status(200).json({ updatePost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Error updating post" });
    }
})
app.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract 'id' from params
        const { data: deletedPost, error } = await db.from("post").delete().eq("id", id).select();
         // Log hasil query
        if (error) throw error;
        console.log("Delete response data:", deletedPost); // Log data hasil delete
        res.status(200).json({ deletedPost });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Error deleting post" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
