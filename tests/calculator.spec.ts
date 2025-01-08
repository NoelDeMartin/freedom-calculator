import { after } from '@noeldemartin/utils';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.clock.setFixedTime(new Date('2025-01-08T12:00:00'));
});

test('shows runway', async ({ page }) => {
    // Act
    await page.getByLabel('How much do you have?').clear();
    await page.getByLabel('How much do you have?').fill('10000{enter}');
    await page.getByLabel('How much do you spend?').clear();
    await page.getByLabel('How much do you spend?').fill('1000{enter}');

    // Assert
    await expect(page.getByText('You are free until')).toBeVisible();
    await expect(page.getByText('November 4, 2025')).toBeVisible();

    await after({ ms: 600 });
    await expect(page).toHaveScreenshot();
});

test('shows FIRE', async ({ page }) => {
    // Act
    await page.getByLabel('How much do you have?').clear();
    await page.getByLabel('How much do you have?').fill('400000{enter}');
    await page.getByLabel('How much do you spend?').clear();
    await page.getByLabel('How much do you spend?').fill('1000{enter}');

    // Assert
    await expect(page.getByText('You are free until')).toBeVisible();
    await expect(page.getByText('November 16, 2057')).toBeVisible();
    await expect(page.getByText('maybe forever')).toBeVisible();

    await after({ ms: 600 });
    await expect(page).toHaveScreenshot();
});

test('shows time to retirement', async ({ page }) => {
    // Act
    await page.getByLabel('How much do you spend?').clear();
    await page.getByLabel('How much do you spend?').fill('1000{enter}');
    await page.getByLabel('How much do you earn?').clear();
    await page.getByLabel('How much do you earn?').fill('2000{enter}');

    // Assert
    await expect(page.getByText('You can retire on')).toBeVisible();
    await expect(page.getByText('August 30, 2049')).toBeVisible();
    await expect(page.getByText('learn how')).toBeVisible();

    await after({ ms: 600 });
    await expect(page).toHaveScreenshot();
});

test('shows early retirement', async ({ page }) => {
    // Act
    await page.getByLabel('How much do you have?').clear();
    await page.getByLabel('How much do you have?').fill('300000{enter}');
    await page.getByLabel('How much do you spend?').clear();
    await page.getByLabel('How much do you spend?').fill('1000{enter}');
    await page.getByLabel('How much do you earn?').clear();
    await page.getByLabel('How much do you earn?').fill('2000{enter}');

    // Assert
    await expect(page.getByText('Congratulations, you can retire')).toBeVisible();
    await expect(page.getByText('today')).toBeVisible();
    await expect(page.getByText('learn how')).toBeVisible();

    await after({ ms: 600 });
    await expect(page).toHaveScreenshot();
});
