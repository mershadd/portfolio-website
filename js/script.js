let educationData, experienceData, awardData;

async function getData(pathVariable) {
  const allData = await fetch(pathVariable);
  const parsed = await allData.json();

  return parsed;
}

function sortData(unsortedData) {
  unsortedData.sort((a, b) => b.start - a.start);

  unsortedData.forEach((_, index, arr) => {
    arr[index].tools.sort();
    arr[index].skills.sort();
  });
}


async function dataToAccordion(filterInput, rawData, accordionId) {
  const parsed = rawData;
  let typeBackground = "text-bg-secondary";
  let allExperience = "";

  for(let i = 0; i < parsed.length; i += 1){
    let tasksList = parsed[i].tasks;
    let isSkip = false;

    if(Object.prototype.toString.call(parsed[i].tasks) === '[object Array]') {
      tasksList = parsed[i].tasks.reduce((acc, item) => {
        return acc + `<li>${item}</li>`;
      }, '<ul>') + '</ul>';
    }

    const toolsList = parsed[i].tools.reduce((acc, item) => {
      return acc + `<li>${item}</li>`;
    }, '<ul>') + '</ul>';

    const skillsList = parsed[i].skills.reduce((acc, item) => {
      return acc + `<li>${item}</li>`;
    }, '<ul>') + '</ul>';

    if(filterInput > 0) {
      isSkip = true;
      for(j in parsed[i].filter) {
        if (parsed[i].filter[j] === filterInput) {
          isSkip = false;
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
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${parsed[i].id}" aria-expanded="false" aria-controls="collapse${i}">
          ${parsed[i].position} - ${parsed[i].company}
          <span class="badge ${typeBackground} d-none d-md-block ms-2">${parsed[i].type}</span>
          <span class="badge text-bg-info d-none d-md-block ms-2">${parsed[i].years}</span>
        </button>
      </h2>
      <div id="collapse${parsed[i].id}" class="accordion-collapse collapse">
        <div class="accordion-body">
          <h3>Description</h3>
          ${tasksList}
          <h3>Tools used</h3>
          ${toolsList}
          <h3>Skills Gained</h3>
          ${skillsList}
        </div>
      </div>
    </div>`
  }

  document.getElementById(accordionId).innerHTML = allExperience;
}

async function handleExpFilter(event, filter) {
  event.preventDefault(); // Prevent actual navigation


  const role = event.target.textContent.trim();
    
  document.getElementById("dropdownExperience").innerHTML = role;
  document.getElementById("accordionExperience").innerHTML = `<div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;

  await dataToAccordion(filter, experienceData, "accordionExperience");
};

async function init() {
  const initExperienceData = await getData('./assets/data/experienceData.json');
  const initEducationData = await getData('./assets/data/educationData.json');
  const initAwardData = await getData('./assets/data/awardData.json');

  sortData(initExperienceData);
  sortData(initEducationData);
  sortData(initAwardData);

  dataToAccordion(0, initExperienceData, "accordionExperience");
  dataToAccordion(0, initEducationData, "accordionEducation");
  dataToAccordion(0, initAwardData, "accordionAward");

  experienceData = initExperienceData;
  educationData = initEducationData;
  awardData = initAwardData;
}


init();