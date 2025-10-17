import { DialogHelper } from '../../helper/DialogHelper';
export class JobTitlesPage {
    constructor(page) {
        this.page = page;
        this.addButton = page.locator('button.oxd-button', { hasText: 'Add' })
        this.form = page.locator('form.oxd-form')
        this.jobTitleTextbox = page.locator('form input.oxd-input')
        this.jobDescriptionTextarea = page.getByPlaceholder('Type description here');
        this.uploadFileInput = page.locator('input.oxd-file-input');
        this.noteTextarea = page.getByPlaceholder('Add note');
        this.saveButton = page.locator('button', { hasText: 'Save' });
        this.jobTitleRows = page.locator('div.oxd-table-body div[role="row"]')
        this.jobTitleCells = this.jobTitleRows.locator('div[role="cell"] >> nth=1')
        this.editButton = this.jobTitleRows.locator('button.oxd-icon-button', {
            has: page.locator('i.oxd-icon.bi-pencil-fill')
        });


    }

    async addJobTitle(jobTitle, jobDescription, jobNote, jobFile) {
        await this.addButton.click();
        await this.form.waitFor({ state: 'visible', timeout: 3000 });
        await this.jobTitleTextbox.fill(jobTitle);
        await this.jobDescriptionTextarea.fill(jobDescription);
        await this.uploadFileInput.setInputFiles(jobFile);
        await this.noteTextarea.fill(jobNote);
        await this.saveButton.click();


    }

    async editJobTitle(oldJobTitleName, newJobTitle) {
        // 1. Lọc ra đúng row theo tên job
        const targetRow = this.page.locator('div.oxd-table-body div[role="row"]').filter({
            hasText: oldJobTitleName
        });

        // 2. Lấy nút Edit bên trong row đó
        const editButton = targetRow.locator('button.oxd-icon-button').filter({
            has: this.page.locator('i.oxd-icon.bi-pencil-fill')
        });

        // 3. Click nút Edit
        await editButton.click();

        // 4. Chờ form hiện lên
        await this.form.waitFor({ state: 'visible', timeout: 3000 });

        // 5. Thay đổi tên job
        await this.jobTitleTextbox.fill(newJobTitle);

        // 6. Lưu lại
        await this.saveButton.click();
    }

    async deleteJobTitle(jobTitleName) {
        // 1. Lọc ra đúng row theo tên job
        const targetRow = this.page.locator('div.oxd-table-body div[role="row"]').filter({
            hasText: jobTitleName
        });

        // 2. Lấy nút Edit bên trong row đó
        const deleteButton = targetRow.locator('button.oxd-icon-button').filter({
            has: this.page.locator('i.oxd-icon.bi-trash')
        });

        // 3. Click nút Edit
        await deleteButton.click();

        // 4. Chờ modal hiện lên
        const deleteModal = new DialogHelper(this.page);
        await deleteModal.waitForVisible();

        // 5. Confirm xóa
        await deleteModal.confirm();

    }
}