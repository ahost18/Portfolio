document.addEventListener("DOMContentLoaded", () => {
    // Parse target destination from query string if available (e.g., ?to=https://blog.lopegaworks.com)
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('to') || CONFIG.defaultDestination;
    
    // Update UI text to display target destination
    document.getElementById('target-url').innerText = destination.replace(/^https?:\/\//, '');

    // Multi-Step Automation Timing Sequence
    const steps = ["step-1", "step-2", "step-3", "step-4"];
    let currentStepIndex = 0;

    function goToStep(index) {
        document.querySelectorAll('.step-view').forEach(el => el.classList.remove('active'));
        const targetStep = document.getElementById(steps[index]);
        if (targetStep) {
            targetStep.classList.add('active');
        }
    }

    // Step progression timeline matching the storyboard flow
    setTimeout(() => {
        currentStepIndex = 1;
        goToStep(currentStepIndex); // Step 2: Preparing Route
        triggerScanningChecklist();
    }, 1500);

    setTimeout(() => {
        currentStepIndex = 2;
        goToStep(currentStepIndex); // Step 3: Opening Portal
    }, 3500);

    setTimeout(() => {
        currentStepIndex = 3;
        goToStep(currentStepIndex); // Step 4: Countdown
        startCountdownTimer(destination);
    }, 5000);
});

// Helper for Step 2 checklist items simulation
function triggerScanningChecklist() {
    const checks = ['chk-2', 'chk-3', 'chk-4'];
    checks.forEach((id, idx) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('active');
        }, (idx + 1) * 600);
    });
}

// Helper for Step 4 Countdown and Final Redirection
function startCountdownTimer(destinationUrl) {
    let timeLeft = 3;
    const counterElem = document.getElementById('countdown-number');
    const secTextElem = document.getElementById('sec-text');

    const timer = setInterval(() => {
        timeLeft--;
        if (counterElem) counterElem.innerText = timeLeft;
        if (secTextElem) secTextElem.innerText = `${timeLeft} second${timeLeft === 1 ? '' : 's'}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            // Execute final redirect
            window.location.href = destinationUrl;
        }
    }, 1000);
}
