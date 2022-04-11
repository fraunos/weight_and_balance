const req = await fetch('/planes')
const planes = await req.json()
let plane

const dropdown = document.querySelector("#planes")
const inputs = document.querySelector("#inputs")

dropdown.addEventListener('change', async ev => {
    plane = await (await fetch(ev.target.value)).json()
    generateForm(plane)
  })


planes.forEach(i=>{
  const el = document.createElement('option')
  el.value = `planesData/${i}`
  el.innerText = i.replace('.json', '')
  
  dropdown.appendChild(el)
  console.log(i)
})


function generateForm(data){
  data.loads.forEach(i => {
      console.log(i)
      let elements = []

      const label = document.createElement('label')
      label.setAttribute('for', i.name)
      label.innerText = i.label
      elements.push(label)

      if(i.type === "base") {
        const empty = document.createElement('span')
        empty.innerText = `${i.weight} ${data.units}`
        elements.push(empty)
      }
      
      if(i.type === "input") {
        const input = document.createElement('input')
        input.setAttribute('id', i.name)
        input.setAttribute('name', i.name)
        input.setAttribute('type', i.inputType)
        elements.push(input)
      }

      const arm = document.createElement('span')
      arm.innerText = i.arm
      elements.push(arm)
    
      console.log(elements)

      inputs.append(...elements)
    })

    const loadInputs = new Array(...document.querySelectorAll('input'))
    console.log(loadInputs)
    loadInputs.forEach(i=>{
      i.addEventListener('change', ev => {
        
        console.log(ev.target.value)
      })
    })

}

