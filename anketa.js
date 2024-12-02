const formData = {};
const form = document.getElementById('anketa');
const progressBar = document.getElementById('progress-bar');


// progress bar
function updateProgress() {
    const fields = [...form.querySelectorAll('input, select')];
    const filledFields = fields.filter(field => field.value.trim() !== '').length;
    const totalFields = fields.length;
    const progress = (filledFields / totalFields) * 100;
    progressBar.value = progress;
}

//asmens kodas
document.getElementById('birthdate').addEventListener('change', function () {
    const gender = document.getElementById('gender').value;
    const birthdate = new Date(this.value);

    if (!isNaN(birthdate) && gender) {
        const year = birthdate.getFullYear();
        const century = Math.floor(year / 100);
        const yearPart = year.toString().slice(2);
        const month = (birthdate.getMonth() + 1).toString().padStart(2, '0');
        const day = birthdate.getDate().toString().padStart(2, '0');

        // pirmas skaitmuo pagal amziu ir lyti
        let genderCode = '';
        if (century === 18) genderCode = gender === 'male' ? '1' : '2'; 
        else if (century === 19) genderCode = gender === 'male' ? '3' : '4'; 
        else if (century === 20) genderCode = gender === 'male' ? '5' : '6'; 

        // id generavimas
        const initialPersonalId = `${genderCode}${yearPart}${month}${day}`;

        // id uzpildymas
        const personalIdField = document.getElementById('personal-id');
        personalIdField.value = initialPersonalId;

        // like skaiciai
        personalIdField.placeholder = 'Įveskite likusius 4 skaitmenis';
        personalIdField.focus();
    }
});

// ar pilnas id
document.getElementById('anketa').addEventListener('submit', function (e) {
    e.preventDefault();

    const personalIdField = document.getElementById('personal-id');
    const personalId = personalIdField.value.trim();

    if (!/^\d{11}$/.test(personalId)) {
        alert('Asmens kodas turi būti 11 skaitmenų.');
        return;
    }

});


//  dynamic vedybine nuo amziaus

document.addEventListener("DOMContentLoaded", () => {
    const dynamicMaritalStatus = document.getElementById('dynamic-marital-status');

    document.getElementById('birthdate').addEventListener('change', function () {
        dynamicMaritalStatus.innerHTML = ''; 

        const birthdateValue = this.value;
        if (!birthdateValue) return; 

        const birthdate = new Date(birthdateValue);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const isBeforeBirthday = today.getMonth() < birthdate.getMonth() ||
            (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate());
        if (isBeforeBirthday) age--;

        if (age > 16) {
            dynamicMaritalStatus.innerHTML = `
                <label for="marital-status">Vedybinė padėtis:</label>
                <select id="marital-status" name="maritalStatus" required>
                    <option value="">Pasirinkti</option>
                    <option value="single">Nevedęs/Netekėjusi</option>
                    <option value="married">Vedęs/Ištekėjusi</option>
                    <option value="divorced">Išsiskyręs(-usi)</option>
                </select>
                <div id="spouse-container" style="display: none;">
                    <label for="spouse">Sutuoktinis(-ė):</label>
                    <input type="text" id="spouse" name="Spouse" placeholder="Įveskite sutuoktinio vardą ir pavardę">
                </div>
            `;

            const maritalStatusSelect = document.getElementById('marital-status');
            const spouseContainer = document.getElementById('spouse-container');

            maritalStatusSelect.addEventListener('change', function () {
                if (this.value === 'married') {
                    spouseContainer.style.display = 'block';
                    document.getElementById('spouse').setAttribute('required', true);
                } else {
                    spouseContainer.style.display = 'none';
                    document.getElementById('spouse').removeAttribute('required');
                }
            });
        }
    });
});


// dinamine isilavinimo

const educationDetails = document.getElementById('education-details');
const educationLevel = document.getElementById('education-level');

educationLevel.addEventListener('change', function () {
    educationDetails.innerHTML = ''; 
    const selectedLevel = this.value;

    if (selectedLevel !== '') {
        // visiems
        educationDetails.innerHTML = `
            <label for="institution">Paskutinė baigta mokslo / studijų įstaiga:</label>
            <input type="text" id="institution" name="institution" placeholder="Įveskite įstaigos pavadinimą" required>
            
            <label for="graduation-year">Baigimo metai:</label>
            <input type="number" id="graduation-year" name="graduationYear" placeholder="Įveskite baigimo metus" required>
        `;
        
        // specifiniai
        if (selectedLevel === 'college' || selectedLevel === 'university') {
            educationDetails.innerHTML += `
                <label for="qualification">Kvalifikacija:</label>
                <input type="text" id="qualification" name="qualification" placeholder="Įveskite kvalifikaciją" required>
            `;

            if (selectedLevel === 'university') {
                educationDetails.innerHTML += `
                    <label for="degree">Mokslo laipsnis:</label>
                    <select id="degree" name="degree" required>
                        <option value="">Pasirinkite</option>
                        <option value="bachelor">Bakalauras</option>
                        <option value="master">Magistras</option>
                        <option value="phd">Mokslų daktras</option>
                    </select>
                `;
            }
        }
    }
});


// dinamine nuo darbo
document.getElementById('occupation-details').addEventListener('change', function () {
    const occupation = this.value;
    const dynamicFields = document.getElementById('occupation-details-dinamic');

    dynamicFields.innerHTML = '';

    if (occupation === 'studying') {
        dynamicFields.innerHTML = `
            <label for="study-level">Studijų pakopa:</label>
            <input type="text" id="study-level" name="studyLevel" placeholder="Įveskite studijų pakopą" required>

            <label for="course">Kursas:</label>
            <input type="number" id="course" name="course" placeholder="Įveskite kursą" required>

            <label for="institution">Įstaiga:</label>
            <input type="text" id="institution" name="institution" placeholder="Įveskite įstaigos pavadinimą" required>

            <label for="expected-graduation">Tikėtini baigimo metai:</label>
            <input type="number" id="expected-graduation" name="expectedGraduation" placeholder="Įveskite tikėtinus baigimo metus" required>
        `;
    } else if (occupation === 'working') {
        dynamicFields.innerHTML = `
            <label for="workplace">Darbo įstaiga:</label>
            <input type="text" id="workplace" name="workplace" placeholder="Įveskite darbo įstaigos pavadinimą" required>

            <label for="position">Pareigos:</label>
            <input type="text" id="position" name="position" placeholder="Įveskite pareigas" required>
        `;
    } else if (occupation === 'not-working') {
        dynamicFields.innerHTML = `
            <label for="unemployment-reason">Nedarbo priežastis:</label>
            <input type="text" id="unemployment-reason" name="unemploymentReason" placeholder="Įveskite nedarbo priežastį" required>
        `;
    } else if (occupation === 'maternity-paterniry-leave') {
        dynamicFields.innerHTML = `
            <label for="leave-end">Atostogų pabaigos data:</label>
            <input type="date" id="leave-end" name="leaveEnd" required>
        `;
    }
});



// sekmingai pateikta
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const elements = form.elements;
    for (let element of elements) {
        if (element.name) {
            formData[element.name] = element.value;
        }
    }
    console.log('Form Data:', formData);
    alert('Anketa sėkmingai pateikta!');
});

// Update progress on input change
form.addEventListener('input', updateProgress);
