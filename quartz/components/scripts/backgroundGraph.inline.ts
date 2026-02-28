document.addEventListener("nav", async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const canvas = document.getElementById("background-graph-canvas") as HTMLCanvasElement
  if (!canvas) return
  
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const data = await fetchData
  
  // draw a test circle in the center just to prove canvas works
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2)
  ctx.fillStyle = "white"
  ctx.fill()
})
