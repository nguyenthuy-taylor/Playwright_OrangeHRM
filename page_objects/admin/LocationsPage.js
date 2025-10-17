import { BasePage } from "../BasePage";
import { NotificationHelper } from "../../helper/NotificationHelper";

export class LocationsPage extends BasePage {
    constructor(page) {
        super(page);
        this.name = page.locator("//label[normalize-space()='Name']/parent::div/following-sibling::div/input");
        this.city = page.locator("//label[normalize-space()='City']/parent::div/following-sibling::div/input");
        this.searchButton = page.locator('button[type="submit"]', { hasText: 'Search' });
        this.addButton = page.locator('button[type="button"]', { hasText: 'Add' });
        this.addLocationName = page.locator("//label[normalize-space()='Name']/parent::div/following-sibling::div/input");
        this.addLocationCity = page.locator("//label[normalize-space()='City']/parent::div/following-sibling::div/input");
        this.addLocationStateProvince = page.locator("//label[normalize-space()='State/Province']/parent::div/following-sibling::div/input");
        this.addLocationZipPostalCode = page.locator("//label[normalize-space()='Zip/Postal Code']/parent::div/following-sibling::div/input");
        this.addLocationPhone = page.locator("//label[normalize-space()='Phone']/parent::div/following-sibling::div/input");
        this.addLocationFax = page.locator("//label[normalize-space()='Fax']/parent::div/following-sibling::div/input");
        this.addLocationAddress = page.locator("//label[normalize-space()='Address']/parent::div/following-sibling::div/textarea");
        this.addLocationNotes = page.locator("//label[normalize-space()='Notes']/parent::div/following-sibling::div/textarea");
        this.addLocationCountryLocation = page.locator("//label[normalize-space()='Country']/parent::div/following-sibling::div//div[@class='oxd-select-text oxd-select-text--active']")
        this.addLocationCountryDropdownItems = page.locator('div[role="listbox"] span');
        this.addLocationSaveButton = page.locator('button[type="submit"]', { hasText: 'Save' });

    }

    async searchForLocation(name, city) {
        await this.name.fill(name);
        await this.city.fill(city);
        await this.searchButton.waitFor({ state: 'visible' });
        await this.searchButton.click();
        await NotificationHelper.waitForLoading(this.page);
    }

    async clickToAddLocation() {
        await this.addButton.waitFor({ state: 'visible' });
        await this.addButton.click();
        const SAVE_LOCATION = /admin\/saveLocation$/;
        await this.page.waitForURL(SAVE_LOCATION, 5000);
    }

    async selectCountry(countryName) {
        await this.selectDropDown(this.addLocationCountryLocation, this.addLocationCountryDropdownItems, countryName);
    }

    async addLocation({ name, city, stateProvince, zipPostalCode, countryName, phone, fax, address, notes }) {
        await this.fillElement(this.addLocationName, name);
        await this.fillElement(this.addLocationCity, city);
        await this.fillElement(this.addLocationStateProvince, stateProvince);
        await this.fillElement(this.addLocationZipPostalCode, zipPostalCode);
        await this.fillElement(this.addLocationPhone, phone);
        await this.fillElement(this.addLocationFax, fax);
        await this.fillElement(this.addLocationAddress, address);
        await this.fillElement(this.addLocationNotes, notes);
        await this.selectCountry(countryName);
        await this.addLocationSaveButton.click();
        await NotificationHelper.waitForLoading(this.page);
        await this.page.waitForLoadState('networkidle');
        await NotificationHelper.isSuccessMessageDisplayed(this.page);
    }
}
