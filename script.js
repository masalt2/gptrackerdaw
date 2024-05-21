document.addEventListener("DOMContentLoaded", () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const patternTable = document.getElementById("pattern-table").querySelector("tbody");
    const playButton = document.getElementById("play-button");

    const steps = 16; // Number of steps in the pattern
    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    const pattern = Array(steps).fill(null);

    function createOscillator(frequency) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        return oscillator;
    }

    function noteToFrequency(note) {
        const A4 = 440;
        const semitonesFromA4 = {
            "C4": -9, "D4": -7, "E4": -5, "F4": -4,
            "G4": -2, "A4": 0, "B4": 2, "C5": 3
        };
        return A4 * Math.pow(2, semitonesFromA4[note] / 12);
    }

    function playPattern() {
        let currentStep = 0;

        function playStep() {
            if (currentStep < steps) {
                const note = pattern[currentStep];
                if (note) {
                    const frequency = noteToFrequency(note);
                    const oscillator = createOscillator(frequency);
                    oscillator.connect(audioContext.destination);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.2);
                }
                currentStep++;
                setTimeout(playStep, 500); // 500ms per step
            }
        }

        playStep();
    }

    // Create table rows
    for (let i = 0; i < steps; i++) {
        const row = document.createElement("tr");
        const stepCell = document.createElement("td");
        const noteCell = document.createElement("td");
        const noteSelect = document.createElement("select");

        stepCell.textContent = i + 1;
        notes.forEach(note => {
            const option = document.createElement("option");
            option.value = note;
            option.textContent = note;
            noteSelect.appendChild(option);
        });

        noteSelect.addEventListener("change", (event) => {
            pattern[i] = event.target.value;
        });

        noteCell.appendChild(noteSelect);
        row.appendChild(stepCell);
        row.appendChild(noteCell);
        patternTable.appendChild(row);
    }

    playButton.addEventListener("click", playPattern);
});
