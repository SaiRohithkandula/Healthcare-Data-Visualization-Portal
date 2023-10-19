 <script>
        function toggleDataView() {
            const dataContainer = document.getElementById('dataContainer');
            dataContainer.classList.toggle('hidden');
        }

        function handleFile() {
            const fileInput = document.getElementById('csvFile');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file.');
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const content = event.target.result;
                processData(content, file.name);
            };

            reader.readAsText(file);
        }

        function processData(content, fileName) {
            const csvRows = content.split('\n');
            const headers = csvRows[0].split(',');
            const data = csvRows.slice(1).map(row => {
                const rowData = row.split(',');
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = rowData[index];
                });
                return obj;
            });

            // Filter data by gender (assuming 'Gender' is the column name)
            const males = data.filter(item => item['gender'] === 'M');
            const females = data.filter(item => item['gender'] === 'F');

            // Count male and female patients
            const maleCount = males.length;
            const femaleCount = females.length;

            // Create the pie chart for gender distribution
            const genderCanvas = document.getElementById('genderPieChart').getContext('2d');
            const genderPieChart = new Chart(genderCanvas, {
                type: 'pie',
                data: {
                    labels: ['Male', 'Female'],
                    datasets: [{
                        data: [maleCount, femaleCount],
                        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Gender Distribution'
                    },
                    plugins: {
                        datalabels: {
                            color: '#fff',
                            formatter: (value) => {
                                return value + ' patients';
                            }
                        }
                    }
                }
            });

            const diseaseCounts = {};
            data.forEach(item => {
                const disease = item['Patient_Disease'];
                diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
            });

            const diseaseLabels = Object.keys(diseaseCounts);
            const diseaseData = diseaseLabels.map(label => diseaseCounts[label]);

            // Create the pie chart with percentages in tooltips
            const diseaseCanvas = document.getElementById('diseasePieChart').getContext('2d');
            const diseasePieChart = new Chart(diseaseCanvas, {
                type: 'pie',
                data: {
                    labels: diseaseLabels,
                    datasets: [{
                        data: diseaseData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)',
                            'rgba(205, 133, 63, 0.7)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(205, 133, 63, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Patient Disease Distribution'
                    },
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const dataset = data.datasets[0];
                                const total = dataset.data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                                const currentValue = dataset.data[tooltipItem.index];
                                const percentage = ((currentValue / total) * 100).toFixed(2) + "%";
                                return `${data.labels[tooltipItem.index]}: ${currentValue} (${percentage})`;
                            }
                        }
                    }
                }
            });
        }
    </script>
   
