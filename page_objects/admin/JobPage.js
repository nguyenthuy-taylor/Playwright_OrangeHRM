class JobPage {
    constructor(page) {
        this.page = page;
        this.jobTitles = new JobTitlesPage(page);
    }
}