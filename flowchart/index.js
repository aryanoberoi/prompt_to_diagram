import OpenAI from "openai";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import express from 'express';
const openai = new OpenAI();
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

async function getMermaidCode(userInput) {
  const completion = await openai.chat.completions.create({
    messages: [
      { "role": "system", "content": "based on the instructions of the user, create a logic tree that includes all the steps and concepts which you need to teach and only output the mermaid code for the logic tree. the output should only have mermaid code nothing else." },
      { "role": "user", "content": userInput }
    ],
    model: "gpt-3.5-turbo",
  });

  let mermaidCode = completion.choices[0].message.content;
  const start = mermaidCode.indexOf('graph');
  const end = mermaidCode.lastIndexOf('```');
  return mermaidCode.slice(start, end).trim();
}

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
 <title>Mermaid Diagram</title>
 <script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
 <script>
    document.addEventListener("DOMContentLoaded", function() {
        mermaid.initialize({startOnLoad:true});
    });
 </script>
</head>
<body>
 <form action="/" method="post">
   <input type="text" name="userInput" placeholder="Enter your prompt here">
   <button type="submit">Generate Diagram</button>
 </form>
 <div class="mermaid"></div>
</body>
</html>`);
});

app.post('/', async (req, res) => {
    const mermaidDiagram = await getMermaidCode(req.body.userInput);
    try {
       const { elements, files } = await parseMermaidToExcalidraw(mermaidDiagram, {
         fontSize: 16, // Example font size, adjust as needed
       });
       // Render elements and files on Excalidraw
       res.send(`
   <!DOCTYPE html>
   <html>
   <head>
    <title>Excalidraw Diagram</title>
    <script src="https://unpkg.com/@excalidraw/excalidraw/dist/excalidraw.min.js"></script>
   </head>
   <body>
    <div id="excalidraw" style="width: 100vw; height: 100vh;"></div>
    <script>
       document.addEventListener("DOMContentLoaded", function() {
           const excalidrawElement = document.getElementById('excalidraw');
           const excalidrawAPI = new Excalidraw(excalidrawElement, {
               initialData: { elements: ${JSON.stringify(elements)}, files: ${JSON.stringify(files)} },
               // Add any other Excalidraw options here
           });
       });
    </script>
   </body>
   </html>`);
    } catch (e) {
       // Handle conversion error, e.g., by displaying an error message to the user
       res.send(`Error converting Mermaid diagram: ${e.message}`);
    }
   });
   

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
