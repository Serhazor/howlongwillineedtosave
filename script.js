function calculateSavings() {
    let incomeAmount = parseFloat(document.getElementById('incomeAmount').value) || 0;
    let incomeFrequency = document.getElementById('incomeFrequency').value;
    let currentMonthlyIncome = convertToMonthly(incomeAmount, incomeFrequency);

    let totalExpenses = Array.from(document.querySelectorAll('.expense')).reduce((acc, expense) => {
        let amount = parseFloat(expense.querySelector('.expenseAmount').value) || 0;
        let frequency = expense.querySelector('input[type="radio"]:checked').value;
        return acc + convertToMonthly(amount, frequency);
    }, 0);

    let disposableIncome = currentMonthlyIncome - totalExpenses;
    let savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;

    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; // Clear previous results

    if (disposableIncome <= 0) {
        resultsDiv.innerHTML = "Your expenses equal or exceed your income. Adjust your budget to start saving.";
        return;
    }

    // Display current monthly income and disposable income
    resultsDiv.innerHTML += `<p>Current Monthly Income: €${currentMonthlyIncome.toFixed(2)}</p>`;
    resultsDiv.innerHTML += `<p>Disposable Income: €${disposableIncome.toFixed(2)}</p>`;

    // Strategies: easy (25%), hard (50%), extreme (75%) of disposable income
    let strategies = {
        easy: 0.25,
        hard: 0.50,
        extreme: 0.75
    };

    Object.entries(strategies).forEach(([strategy, percentage]) => {
        let monthlySavings = disposableIncome * percentage;
        let durationMonths = Math.ceil(savingsGoal / monthlySavings);
        let targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + durationMonths);

        // First part of output: duration with current income
        resultsDiv.innerHTML += `<p>${strategy.charAt(0).toUpperCase() + strategy.slice(1)} saving strategy with current income: 
        You can save €${monthlySavings.toFixed(2)} per month, reaching your goal of €${savingsGoal} in ${durationMonths} months by ${targetDate.toDateString()}.</p>`;

        // Calculate the required monthly income to comfortably reach the savings goal within a year
        let requiredMonthlyIncome = ((savingsGoal / 12) / percentage) + totalExpenses;
        let disposableCashFromRequiredIncome = requiredMonthlyIncome - totalExpenses;

        // Second part of output: desired monthly income for a yearly goal reach and disposable cash
        resultsDiv.innerHTML += `<p>To comfortably reach your savings goal within a year using the ${strategy} strategy, 
        you would need a monthly income of €${requiredMonthlyIncome.toFixed(2)}, 
        resulting in disposable cash of €${disposableCashFromRequiredIncome.toFixed(2)} 
        after saving €${(savingsGoal / 12).toFixed(2)} per month.</p>`;
    });
}

function convertToMonthly(amount, frequency) {
    switch (frequency) {
        case 'weekly':
            return amount * 52 / 12;
        case 'fortnightly':
            return amount * 26 / 12;
        default:
            return amount;
    }
}

document.addEventListener('DOMContentLoaded', () => calculateSavings()); // Optional: to calculate immediately on page load
