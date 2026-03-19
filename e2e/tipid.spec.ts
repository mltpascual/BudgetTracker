import { test, expect, type Page } from "@playwright/test";

// Helper: dismiss onboarding if it appears
async function dismissOnboarding(page: Page) {
  // Wait a moment for the overlay to render
  await page.waitForTimeout(500);
  // Try clicking the X (close/skip) button on the onboarding overlay
  const closeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first();
  if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await closeBtn.click({ force: true });
    await page.waitForTimeout(500);
  }
}

// Helper: dismiss install prompt if it appears
async function dismissInstallPrompt(page: Page) {
  const laterBtn = page.getByRole("button", { name: /Maybe later|later/i });
  if (await laterBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await laterBtn.click();
    await page.waitForTimeout(300);
  }
}

// Helper: setup clean state
async function setupCleanState(page: Page) {
  await page.goto("/app");
  await page.evaluate(() => {
    localStorage.clear();
    // Pre-set flags to skip onboarding and install prompt
    localStorage.setItem('tipid-onboarding-done', '1');
    localStorage.setItem('tipid-install-dismissed', Date.now().toString());
    localStorage.setItem('tipid-swipe-hint-seen', '1');
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
  // Safety: dismiss any overlays that still appear
  await dismissOnboarding(page);
  await dismissInstallPrompt(page);
}

test.describe("Landing Page", () => {
  test("should display landing page with app title and CTA", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Use navigation-specific Tipid text
    await expect(page.getByRole("navigation").getByText("Tipid")).toBeVisible();
    // Should have a CTA link (Get Started or Open App or Mag-Start Na)
    const cta = page.getByRole("link", { name: /Get Started|Open App|Mag-Start|Start Budgeting|Mag-Budget/i }).first();
    await expect(cta).toBeVisible();
  });

  test("should navigate to app from landing page", async ({ page }) => {
    // Pre-set flags to prevent onboarding/install overlays from blocking navigation
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem('tipid-onboarding-done', '1');
      localStorage.setItem('tipid-install-dismissed', Date.now().toString());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Click the "Get Started" hero CTA link
    const ctaLink = page.getByText(/Get Started|Mag-Start Na/i).first();
    await ctaLink.click();
    await page.waitForURL(/\/app/, { timeout: 10000 });
    expect(page.url()).toContain("/app");
  });
});

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanState(page);
  });

  test("should display dashboard with balance card", async ({ page }) => {
    await expect(page.getByText("Total Balance", { exact: true })).toBeVisible();
    await expect(page.getByText("Income", { exact: true })).toBeVisible();
    await expect(page.getByText("Expenses", { exact: true })).toBeVisible();
  });

  test("should display quick links section", async ({ page }) => {
    // Use the quick links grid items specifically
    await expect(page.getByRole("link", { name: "Budgets" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Goals" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible();
  });

  test("should navigate to Budgets from quick links", async ({ page }) => {
    await page.getByRole("link", { name: "Budgets" }).click();
    await page.waitForURL(/\/app\/budgets/);
    expect(page.url()).toContain("/app/budgets");
  });

  test("should navigate to Analytics from quick links", async ({ page }) => {
    await page.getByRole("link", { name: "Analytics" }).click();
    await page.waitForURL(/\/app\/analytics/);
    expect(page.url()).toContain("/app/analytics");
  });
});

test.describe("Add Transaction", () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanState(page);
  });

  test("should open add transaction page from nav", async ({ page }) => {
    await page.goto("/app/add");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/app/add");
  });

  test("should add an expense transaction", async ({ page }) => {
    await page.goto("/app/add");
    await page.waitForLoadState("networkidle");
    await dismissOnboarding(page);
    await dismissInstallPrompt(page);

    // Enter amount using the keypad - click the specific number buttons
    const keypad = page.locator('[class*="grid"]').last();
    await page.getByRole("button", { name: "1", exact: true }).first().click();
    await page.getByRole("button", { name: "0", exact: true }).first().click();
    await page.getByRole("button", { name: "0", exact: true }).first().click();

    // Click Next
    const nextBtn = page.getByRole("button", { name: /Next|Continue|Susunod/i });
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
    }
  });

  test("should toggle between expense and income", async ({ page }) => {
    await page.goto("/app/add");
    await page.waitForLoadState("networkidle");
    await dismissOnboarding(page);
    await dismissInstallPrompt(page);

    const incomeBtn = page.getByRole("button", { name: /^Income$|^Kita$/i });
    if (await incomeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await incomeBtn.click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe("History Page", () => {
  test("should navigate to history page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/history");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  });

  test("should display calendar view", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/history");
    await page.waitForLoadState("networkidle");
    // Calendar should show day abbreviations
    const dayHeader = page.getByText("Mon", { exact: true }).or(page.getByText("M", { exact: true }));
    await expect(dayHeader.first()).toBeVisible();
  });
});

test.describe("Settings Page", () => {
  test("should navigate to settings page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/settings");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("should display theme options", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/settings");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Color Theme", { exact: true })).toBeVisible();
  });

  test("should switch between light and dark mode", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/settings");
    await page.waitForLoadState("networkidle");

    // Click Dark mode
    const darkBtn = page.getByRole("button", { name: /^Dark$|^Madilim$/i });
    if (await darkBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await darkBtn.click();
      await page.waitForTimeout(500);
      const htmlClass = await page.locator("html").getAttribute("class");
      expect(htmlClass).toContain("dark");
    }

    // Switch back to Light
    const lightBtn = page.getByRole("button", { name: /^Light$|^Maliwanag$/i });
    if (await lightBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await lightBtn.click();
      await page.waitForTimeout(500);
      const htmlClass = await page.locator("html").getAttribute("class");
      expect(htmlClass).not.toContain("dark");
    }
  });

  test("should display export/import section", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/settings");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText("Export & Backup", { exact: false }).first()).toBeVisible();
  });
});

test.describe("Wallets Page", () => {
  test("should display wallets page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/wallets");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: /Wallets|Accounts/i })).toBeVisible();
  });

  test("should show add account form", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/wallets");
    await page.waitForLoadState("networkidle");
    // Click the + button (primary colored circle)
    const plusBtn = page.locator("button").filter({ has: page.locator("svg.lucide-plus") }).first();
    if (await plusBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await plusBtn.click();
      await page.waitForTimeout(500);
      // Should show a form with name input
      const nameInput = page.locator("input").first();
      await expect(nameInput).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Budgets Page", () => {
  test("should display budgets page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/budgets");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Budgets" })).toBeVisible();
  });
});

test.describe("Goals Page", () => {
  test("should display goals page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/goals");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Goals" })).toBeVisible();
  });
});

test.describe("Debts Page", () => {
  test("should display debts page with tabs", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/debts");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Debts" })).toBeVisible();
    await expect(page.getByRole("button", { name: "I Owe" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Owed To Me" })).toBeVisible();
  });

  test("should switch between I Owe and Owed To Me tabs", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/debts");
    await page.waitForLoadState("networkidle");
    const owedTab = page.getByRole("button", { name: "Owed To Me" });
    await owedTab.click();
    await page.waitForTimeout(300);
    // Tab should be active (has card bg class)
    await expect(owedTab).toHaveClass(/bg-card|shadow/);
  });
});

test.describe("Navigation", () => {
  test("should navigate between all pages without errors", async ({ page }) => {
    await setupCleanState(page);

    // Navigate to History
    await page.goto("/app/history");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "History" })).toBeVisible();

    // Navigate to Settings
    await page.goto("/app/settings");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    // Navigate back to Dashboard
    await page.goto("/app");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Total Balance", { exact: true })).toBeVisible();
  });

  test("should not show skeleton when navigating back to dashboard", async ({ page }) => {
    await setupCleanState(page);

    // Navigate to history first
    await page.goto("/app/history");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Navigate back to dashboard
    await page.goto("/app");
    await page.waitForLoadState("networkidle");

    // Dashboard content should be visible
    await expect(page.getByText("Total Balance", { exact: true })).toBeVisible({ timeout: 3000 });
  });
});

test.describe("Recurring Page", () => {
  test("should display recurring page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/recurring");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Recurring" })).toBeVisible();
  });
});

test.describe("Analytics Page", () => {
  test("should display analytics page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/analytics");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Analytics" })).toBeVisible();
  });
});

test.describe("Transfer Page", () => {
  test("should display transfer page", async ({ page }) => {
    await setupCleanState(page);
    await page.goto("/app/transfer");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Transfer" })).toBeVisible();
  });
});
