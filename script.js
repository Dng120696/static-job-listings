class JobBoard {
  constructor() {
    this.mainContainer = document.querySelector(".main-container");
    this.dataBox = document.querySelector(".data-box");
    this.dataBoxStored = document.querySelector(".data-stored-box");
    this.dataStored = [];
    this.newData = null;
    this.fetchData();
  }

  fetchData() {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        this.newData = data;
        this.renderData(this.newData);
      })
      .catch((error) => {
        console.error("Error fetching JSON file:", error);
      });
  }

  renderData(data) {
    this.mainContainer.innerHTML = "";
    data.forEach((el) => {
      el.newArr = [el.role, el.level, ...el.tools, ...el.languages];

      const buttons = el.newArr
        .map((item) => `<button>${item}</button>`)
        .join("");

      const html = `
        <section class="section-${el.id} section--hidden flex flex-col ${
        el.featured && el.new ? "border-green" : ""
      }">
          <article class="left-section flex flex-col">
            <div class="logo">
              <img src="${el.logo}" alt="">
            </div>
            <div>
              <p class="company-name">
                <span class="clr-dark-cyan">${el.company}</span>
                <span style="display:${el.new ? "inline-block" : "none"}">${
        el.new ? "NEW!" : ""
      }</span>
                <span style="display:${
                  el.featured ? "inline-block" : "none"
                }">${el.featured ? "FEATURED" : ""}</span>
              </p>
              <h1 class="position">
                ${el.position}
              </h1>
              <ul class="flex">
                <li class="posted-at">${el.postedAt}</li>
                <li class="contract">${el.contract}</li>
                <li class="location">${el.location}</li>
              </ul>
            </div>
          </article>
          <hr>
          <article class="buttons flex clr-dark-cyan">
            ${buttons}
          </article>
        </section>
      `;

      this.mainContainer.insertAdjacentHTML("beforeend", html);
    });

    const buttonElements = this.mainContainer.querySelectorAll("button");
    buttonElements.forEach((button) => {
      button.addEventListener("click", () => {
        const buttonText = button.textContent;

        if (!this.dataStored.includes(buttonText)) {
          this.dataStored.push(buttonText);
          this.renderDataStored(this.dataStored);
        }
        this.displayData();
      });
    });

    this.dataBox.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        console.log("click");
        const { index } = e.target.dataset;
        this.dataStored.splice(index, 1);
        this.renderDataStored(this.dataStored);
        this.displayData();
      }
    });
    const section = document.querySelectorAll(
      "section:not(.section-1,.section-2)"
    );

    const secEntry = (entries, observer) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(secEntry, {
      root: null,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    section.forEach((sec) => sectionObserver.observe(sec));
  }

  renderDataStored(data) {
    this.dataBoxStored.innerHTML = "";
    data.forEach((data, i) => {
      const stored = `
        <p class="flex data-name">
          <span>${data}</span>
          <span>   <img src="./images/icon-remove.svg" alt="" class="delete-btn" data-index=${i}>
          </span>
        </p>
      `;
      this.dataBoxStored.insertAdjacentHTML("beforeend", stored);
    });
  }

  displayData() {
    if (this.dataStored.length === 0) {
      this.renderData(this.newData);
      this.dataBox.classList.remove("show-data-box");
    } else {
      this.dataBox.classList.add("show-data-box");
      const filterData = this.newData.filter((data) =>
        this.dataStored.every((item) => data.newArr.includes(item))
      );
      this.renderData(filterData);
    }
  }

  clearData() {
    this.dataStored = [];
    this.renderDataStored(this.dataStored);
    this.displayData();
  }
}

const jobBoard = new JobBoard();
document.querySelector(".clear-data").addEventListener("click", () => {
  jobBoard.clearData();
});
