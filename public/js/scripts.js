document.addEventListener('DOMContentLoaded', function() {
    function fetchData(callback) {
        fetch('/data')
            .then(response => response.json())
            .then(data => callback(data));
    }

    function saveData(data) {
        fetch('/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    function updateGraphsList(graphs) {
        let graphsList = document.getElementById('graphsList');
        graphsList.innerHTML = '';
        graphs.forEach((graph, index) => {
            let li = document.createElement('li');
            li.innerHTML = `<a href="#" data-index="${index}">Graph ${index + 1}</a>`;
            graphsList.appendChild(li);
        });
        $(graphsList).listview('refresh');
    }

    function updateContactsList(contacts) {
        let contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        contacts.forEach(contact => {
            let li = document.createElement('li');
            li.innerHTML = `<a href="#" data-email="${contact.email}">${contact.name}</a>`;
            contactsList.appendChild(li);
        });
        $(contactsList).listview('refresh');
    }

    $(document).on('pageinit', '#create-graphs', function() {
        let ctx = document.getElementById('socialBatteryChart').getContext('2d');
        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Social Battery', 'Stress', 'Emotional Wellbeing', 'Physical Wellbeing'],
                datasets: [{
                    label: 'Current Levels',
                    data: [50, 50, 50, 50],
                    backgroundColor: ['red', 'blue', 'green', 'yellow']
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        document.getElementById('graphForm').addEventListener('submit', function(event) {
            event.preventDefault();
            let socialBattery = document.getElementById('socialBattery').value;
            let stress = document.getElementById('stress').value;
            let emotionalWellbeing = document.getElementById('emotionalWellbeing').value;
            let physicalWellbeing = document.getElementById('physicalWellbeing').value;
            chart.data.datasets[0].data = [socialBattery, stress, emotionalWellbeing, physicalWellbeing];
            chart.update();

            fetchData(data => {
                data.graphs.push(chart.data);
                saveData(data);
            });
        });
    });

    $(document).on('pageinit', '#view-graphs', function() {
        fetchData(data => {
            updateGraphsList(data.graphs);
        });
    });

    $(document).on('pageinit', '#add-contacts', function() {
        document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault();
            let name = document.getElementById('name').value;
            let email = document.getElementById('email').value;

            fetchData(data => {
                data.contacts.push({ name, email });
                saveData(data);
                updateContactsList(data.contacts);
            });
        });

        fetchData(data => {
            updateContactsList(data.contacts);
        });
    });

    $(document).on('pageinit', '#send-graphs', function() {
        fetchData(data => {
            let contactsFieldset = document.querySelector('#sendGraphsForm fieldset');
            contactsFieldset.innerHTML = '<legend>Select Contacts:</legend>';
            data.contacts.forEach(contact => {
                let label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" name="contacts" value="${contact.email}">${contact.name}`;
                contactsFieldset.appendChild(label);
            });

            document.getElementById('sendQrCode').addEventListener('click', function() {
                let selectedContacts = Array.from(document.querySelectorAll('input[name="contacts"]:checked')).map(input => input.value);
                let qrCodeData = JSON.stringify({ contacts: selectedContacts, graphs: data.graphs });
                let qrCodeCanvas = document.getElementById('qrCodeCanvas');
                let qrCode = new QRCode(qrCodeCanvas, {
                    text: qrCodeData,
                    width: 128,
                    height: 128
                });
                $('#qrCodeCanvas').show();
            });
        });
    });
});
