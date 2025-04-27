async function getData(filter, path, elementId) {
  const allData = await fetch(path);
  const parsed = await allData.json();
  let typeBackground = "text-bg-secondary";
  let allExperience = "";

  parsed.sort((a, b) => b.start - a.start);

  for(let i = 0; i < parsed.length; i += 1){
    let expTask = parsed[i].tasks;
    if(Object.prototype.toString.call(parsed[i].tasks) === '[object Array]') {
      expTask = parsed[i].tasks.reduce((acc, item) => {
        return acc + `<li>${item}</li>`;
      }, '<ul>') + '</ul>';
    }

    let isSkip = false;
    if(filter > 0) {
      isSkip = true;
      for(j in parsed[i].skills) {
        if (parsed[i].skills[j] === filter) {
          isSkip = false
        }
      }
    }
    if(isSkip) {
      continue;
    }

    switch(parsed[i].typebg) {
      case 1:
        typeBackground = "text-bg-danger";
        break;
      case 2:
        typeBackground = "text-bg-warning";
        break;
      case 3:
        typeBackground = "text-bg-success";
        break;
      case 4:
        typeBackground = "text-bg-primary";
        break;
    }

    allExperience += `<div class="accordion-item">
      <h2 class="accordion-header">
      <span class="badge text-bg-primary d-block d-md-none"><strong>${parsed[i].type}:&nbsp</strong>${parsed[i].years}</span>
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
          ${parsed[i].position} - ${parsed[i].company}
          <span class="badge ${typeBackground} d-none d-md-block ms-2">${parsed[i].type}</span>
          <span class="badge text-bg-info d-none d-md-block ms-2">${parsed[i].years}</span>
        </button>
      </h2>
      <div id="collapse${i}" class="accordion-collapse collapse">
        <div class="accordion-body">
          ${expTask}
        </div>
      </div>
    </div>`
  }

  document.getElementById(elementId).innerHTML = allExperience;
}


async function handleExpFilter(event, filter) {
    event.preventDefault(); // Prevent actual navigation


    const role = event.target.textContent.trim();
    
    document.getElementById("dropdownExperience").innerHTML = role;
    document.getElementById("accordionExperience").innerHTML = `<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;

    await getData(filter, "./assets/data/experienceData.json", "accordionExperience");
}

getData(0, "./assets/data/experienceData.json", "accordionExperience");
getData(0, "./assets/data/educationData.json", "accordionEducation");