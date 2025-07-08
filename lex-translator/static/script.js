console.log("Script loaded!");

async function translate() {
  alert("Translate function called!");
  const text = document.getElementById("inputText").value;
  console.log("Input text:", text);

  const response = await fetch("/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  });

  const data = await response.json();
  console.log("API response:", data);

  document.getElementById("result").innerText = data.translation || data.error;
}

document.getElementById("translateBtn").onclick = translate; // ✅ JS connects the button!
