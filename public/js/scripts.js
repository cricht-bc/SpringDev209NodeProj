$(document).on('pageinit', '#create-graphs', function() {
    var ctx = document.getElementById('socialBatteryChart').getContext('2d');
    var chart = new Chart(ctx, {
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

    $('#graphForm').submit(function(event) {
        event.preventDefault();
        var socialBattery = $('#socialBattery').val();
        var stress = $('#stress').val();
        var emotionalWellbeing = $('#emotionalWellbeing').val();
        var physicalWellbeing = $('#physicalWellbeing').val();
        chart.data.datasets[0].data = [socialBattery, stress, emotionalWellbeing, physicalWellbeing];
        chart.update();

        var savedGraphs = JSON.parse(localStorage.getItem('savedGraphs')) || [];
        savedGraphs.push(chart.data);
        localStorage.setItem('savedGraphs', JSON.stringify(savedGraphs));
    });
});

$(document).on('pageinit', '#view-graphs', function() {
    var savedGraphs = JSON.parse(localStorage.getItem('savedGraphs')) || [];
    savedGraphs.forEach(function(graphData, index) {
        $('#graphsList').append(`<li><a href="#create-graphs" data-transition="slide">Graph ${index + 1}</a></li>`);
    });
    $('#graphsList').listview('refresh');
});

$(document).on('pageinit', '#add-contacts', function() {
    $('#contactForm').submit(function(event) {
        event.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();
        var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.push({ name, email });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        alert('Contact added');
    });
});

$(document).on('pageinit', '#send-graphs', function() {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.forEach(function(contact, index) {
        $('fieldset').append(`<label><input type="checkbox" name="contacts" value="${contact.email}">${contact.name}</label>`);
    });

    $('#sendQrCode').click(function() {
        var selectedContacts = $('input[name="contacts"]:checked').map(function() {
            return $(this).val();
        }).get();
        var qrCodeData = JSON.stringify({ contacts: selectedContacts, graphs: JSON.parse(localStorage.getItem('savedGraphs')) });
        var qrCodeCanvas = document.getElementById('qrCodeCanvas');
        var qrCode = new QRCode(qrCodeCanvas, {
            text: qrCodeData,
            width: 128,
            height: 128
        });
        $('#qrCodeCanvas').show();
    });
});
