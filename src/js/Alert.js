export default class Alert {
  constructor(path) {
    // path to the json file
    this.path = path;
    // array to hold the alerts
    this.alerts = [];
  }

  async getData() {
    try {
      const response = await fetch(this.path);
      if (response.ok) {
        this.alerts = await response.json();
      }
    } catch (error) {
      // if the json file is empty it will throw an error, but we don't need to log it
    }
  }

  async init() {
    await this.getData();
    if (this.alerts.length > 0) {
      const section = document.createElement("section");
      section.classList.add("alert-list");

      this.alerts.forEach((alert) => {
        const p = document.createElement("p");
        p.style.backgroundColor = alert.background;
        p.style.color = alert.color;
        p.textContent = alert.message;
        section.appendChild(p);
      });

      document.body.insertBefore(section, document.querySelector("main"));
    }
  }
}
