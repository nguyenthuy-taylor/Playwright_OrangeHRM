import { BasePage } from '../BasePage'
import { NotificationHelper } from '../../helper/NotificationHelper'
import { time } from 'console';
import { expect } from '@playwright/test';

export class UserManagementPage extends BasePage {
    constructor(page) {
        super(page);
        this.userRoleDropdown = page.locator("//label[normalize-space()='User Role']/parent::div/following-sibling::div/div");
        this.userRoleDropdownItems = page.locator("//label[normalize-space()='User Role']/parent::div/following-sibling::div/div/div[@role='listbox']/div/span");
        this.employeeNameTextbox = page.locator("//label[normalize-space()='Employee Name']/parent::div/following-sibling::div//input");
        this.suggestedItems = page.locator('div.oxd-autocomplete-dropdown>div>span');
        this.searchButton = page.locator('button.orangehrm-left-space');
        this.rowList = page.locator('div.oxd-table-card');

        this.addButton = page.locator("//button[normalize-space()='Add']");
        this.addUserUserRoleDropdown = page.locator("//label[normalize-space()='User Role']/parent::div/following-sibling::div/div")
        this.addUserUserRoleDropdownItems = page.locator("//label[normalize-space()='User Role']/parent::div/following-sibling::div/div/div[@role='listbox']/div/span")
        this.addUserStatusDropdown = page.locator("//label[normalize-space()='Status']/parent::div/following-sibling::div/div")
        this.addUserStatusDropdownItems = page.locator("//label[normalize-space()='Status']/parent::div/following-sibling::div/div/div[@role='listbox']/div/span")
        this.addUserEmployeeNameTextbox = page.locator("//label[normalize-space()='Employee Name']/parent::div/following-sibling::div//input")
        this.addUserEmployeeNameSuggestedItems = page.locator("div.oxd-autocomplete-dropdown>div>span")
        this.addUserUsernameTextbox = page.locator("//label[normalize-space()='Username']/parent::div/following-sibling::div/input")
        this.addUserPasswordTextbox = page.locator("//label[normalize-space()='Password']/parent::div/following-sibling::div/input")
        this.addUserConfirmPasswordTextbox = page.locator("//label[normalize-space()='Confirm Password']/parent::div/following-sibling::div/input")
        this.addNewSaveButton = page.locator('button.orangehrm-left-space');
        this.deleteIcon  = page.locator('button i.bi-trash');
        this.dialogContainer = page.locator('div[role="dialog"] div.oxd-dialog-container-default')

    }

    async selectUserName(userName) {
        await this.addUserUsernameTextbox.fill(userName);
    }

    async selectUserRoleOption(role) {
        await this.selectDropDown(this.userRoleDropdown, this.userRoleDropdownItems, role);
    }
    async searchAndSelectAnEmployeeName(inputValue, expectedValue) {
        await this.searchAndSelectASuggestItem(this.employeeNameTextbox, this.suggestedItems, inputValue, expectedValue)
    }
    async clickToSearchButton() {
        await this.searchButton.click();
        await NotificationHelper.isLoadingPresent(this.page);
        await NotificationHelper.isLoadingPresent(this.page);
    }
    async verifyReturnResults(username, userRole, employeeName, status) {
        const rows = await this.rowList;
        const rowCount = await rows.count();
        const allRowsCells = await Promise.all(
            Array.from({ length: rowCount }).map(async (i) => {
                return await rows.nth(i).locator("[role='cell']>div").allTextContents();
            })
        );

        // Kết quả cho từng dòng
        const resultPerRow = allRowsCells.map((cells, i) => {
            return (
                cells[1] === username &&
                cells[2] === userRole &&
                cells[3] === employeeName &&
                cells[4] === status
            );
        });

        return resultPerRow; // Mảng true/false cho từng dòng
    }

    /* --- Alternative approach with For loop


  async verifyReturnResults(username, userRole, employeeName, status) {
  const rows = await this.rowList;
  const rowCount = await rows.count();
  const allRowsCells = await Promise.all(
      Array.from({ length: rowCount }).map(async (i) => {
          return await rows.nth(i).locator("[role='cell']>div").allTextContents();
      })
  );

  // Dùng for để kiểm tra và tạo mảng kết quả
  const resultPerRow = [];
  for (let i = 0; i < rowCount; i++) {
      const cells = allRowsCells[i];
      const isMatched =
          cells[1] === username &&
          cells[2] === userRole &&
          cells[3] === employeeName &&
          cells[4] === status;
      resultPerRow.push(isMatched);
  }

  return resultPerRow; // Mảng true/false cho từng dòng
}
  */

    async addNewUser(userRoleValue, inputValue, employeeNameValue, statusValue, usernameValue, passwordValue) {
        await this.addButton.click();
        await this.addUserUserRoleDropdown.waitFor({ state: 'visible', timeout: 3000 });
        await this.selectDropDown(this.addUserUserRoleDropdown, this.addUserUserRoleDropdownItems, userRoleValue);
        await this.searchAndSelectASuggestItem(this.addUserEmployeeNameTextbox, this.addUserEmployeeNameSuggestedItems, inputValue, employeeNameValue);
        await this.selectDropDown(this.addUserStatusDropdown, this.addUserStatusDropdownItems, statusValue);
        await this.addUserUsernameTextbox.fill(usernameValue);
        await this.addUserPasswordTextbox.fill(passwordValue);
        await this.addUserConfirmPasswordTextbox.fill(passwordValue);
        console.log('Visible:', await this.addNewSaveButton.isVisible());
        console.log('Enabled:', await this.addNewSaveButton.isEnabled());
        await this.addNewSaveButton.click();
        await NotificationHelper.isLoadingPresent(this.page);
        await NotificationHelper.isLoadingFired(this.page);
        await NotificationHelper.isSuccessMessageDisplayed(this.page);
    }

    async deleteAnUser() {
        await this.deleteIcon.first().click();
        await this.dialogContainer.waitFor({ state: 'visible', timeout: 3000 });
        const confirmButton = this.dialogContainer.locator('button.oxd-button--label-danger');
        await confirmButton.click();
        await NotificationHelper.isLoadingPresent(this.page);
        await NotificationHelper.isLoadingFired(this.page);
        await NotificationHelper.isSuccessMessageDisplayed(this.page);
    }
}   