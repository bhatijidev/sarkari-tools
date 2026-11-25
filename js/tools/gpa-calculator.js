// GPA Calculator - 4.0 Scale Logic
document.addEventListener('DOMContentLoaded', () => {
  const courseList = document.getElementById('courseList');
  const btnAddCourse = document.getElementById('btnAddCourse');
  const priorGpa = document.getElementById('priorGpa');
  const priorCredits = document.getElementById('priorCredits');
  const dispUnweightedGpa = document.getElementById('dispUnweightedGpa');
  const dispWeightedGpa = document.getElementById('dispWeightedGpa');
  const dispTotalCredits = document.getElementById('dispTotalCredits');
  const dispTotalPoints = document.getElementById('dispTotalPoints');
  const dispHonorStatus = document.getElementById('dispHonorStatus');
  const cumGpaBox = document.getElementById('cumGpaBox');
  const dispNewCumGpa = document.getElementById('dispNewCumGpa');
  const btnPrintGpa = document.getElementById('btnPrintGpa');

  const gradeValues = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const initialCourses = [
    { name: 'Calculus I', grade: 'A', credits: 4, weight: 'regular' },
    { name: 'AP Physics C', grade: 'A-', credits: 4, weight: 'ap' },
    { name: 'English Literature', grade: 'B+', credits: 3, weight: 'honors' },
    { name: 'Economics', grade: 'A', credits: 3, weight: 'regular' }
  ];

  function createCourseRow(c = { name: '', grade: 'A', credits: 3, weight: 'regular' }) {
    const row = document.createElement('div');
    row.className = 'course-row';
    row.innerHTML = `
      <input type="text" class="form-input c-name" placeholder="Course name" value="${c.name}">
      <select class="form-select c-grade">
        ${Object.keys(gradeValues).map(g => `<option value="${g}" ${g === c.grade ? 'selected' : ''}>${g} (${gradeValues[g]})</option>`).join('')}
      </select>
      <input type="number" class="form-input c-credits" value="${c.credits}" min="0.5" max="10" step="0.5">
      <select class="form-select c-weight">
        <option value="regular" ${c.weight === 'regular' ? 'selected' : ''}>Regular (0.0)</option>
        <option value="honors" ${c.weight === 'honors' ? 'selected' : ''}>Honors (+0.5)</option>
        <option value="ap" ${c.weight === 'ap' ? 'selected' : ''}>AP/IB (+1.0)</option>
      </select>
      <button type="button" class="btn-del-course" title="Delete course">×</button>
    `;

    row.querySelector('.btn-del-course').addEventListener('click', () => {
      if (courseList.children.length > 1) {
        row.remove();
        calculate();
      }
    });

    row.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calculate));
    return row;
  }

  initialCourses.forEach(c => courseList.appendChild(createCourseRow(c)));
  btnAddCourse.addEventListener('click', () => {
    courseList.appendChild(createCourseRow());
    calculate();
  });

  [priorGpa, priorCredits].forEach(el => el.addEventListener('input', calculate));

  function calculate() {
    let totalCredits = 0;
    let unweightedPoints = 0;
    let weightedPoints = 0;

    const rows = courseList.querySelectorAll('.course-row');
    rows.forEach(r => {
      const grade = r.querySelector('.c-grade').value;
      const credits = parseFloat(r.querySelector('.c-credits').value) || 0;
      const weight = r.querySelector('.c-weight').value;

      if (credits > 0) {
        totalCredits += credits;
        const baseVal = gradeValues[grade] || 0;
        unweightedPoints += baseVal * credits;

        let extra = 0;
        if (weight === 'honors') extra = 0.5;
        else if (weight === 'ap') extra = 1.0;

        weightedPoints += (baseVal + extra) * credits;
      }
    });

    const unweightedGpa = totalCredits > 0 ? (unweightedPoints / totalCredits) : 0;
    const weightedGpa = totalCredits > 0 ? (weightedPoints / totalCredits) : 0;

    dispUnweightedGpa.textContent = unweightedGpa.toFixed(2);
    dispWeightedGpa.textContent = weightedGpa.toFixed(2);
    dispTotalCredits.textContent = totalCredits;
    dispTotalPoints.textContent = unweightedPoints.toFixed(1);

    if (unweightedGpa >= 3.8) {
      dispHonorStatus.textContent = "Summa Cum Laude / Dean's List";
      dispHonorStatus.style.color = "#16a34a";
    } else if (unweightedGpa >= 3.5) {
      dispHonorStatus.textContent = "Magna Cum Laude / Honors";
      dispHonorStatus.style.color = "#2563eb";
    } else if (unweightedGpa >= 3.0) {
      dispHonorStatus.textContent = "Good Standing";
      dispHonorStatus.style.color = "#475569";
    } else {
      dispHonorStatus.textContent = "Needs Improvement";
      dispHonorStatus.style.color = "#dc2626";
    }

    // Cumulative GPA Calculation
    const priorG = parseFloat(priorGpa.value);
    const priorC = parseFloat(priorCredits.value);

    if (!isNaN(priorG) && !isNaN(priorC) && priorC > 0) {
      const priorPoints = priorG * priorC;
      const newTotalCredits = priorC + totalCredits;
      const newTotalPoints = priorPoints + unweightedPoints;
      const finalCum = newTotalPoints / newTotalCredits;
      dispNewCumGpa.textContent = finalCum.toFixed(2);
      cumGpaBox.style.display = 'block';
    } else {
      cumGpaBox.style.display = 'none';
    }
  }

  btnPrintGpa.addEventListener('click', () => {
    window.print();
  });

  calculate();
});
