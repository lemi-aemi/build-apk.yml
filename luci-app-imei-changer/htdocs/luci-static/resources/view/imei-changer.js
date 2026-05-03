'use strict';
'use ui';

return L.view.extend({
    render: function() {
        return E('div', { 'class': 'cbi-map' }, [
            E('h2', 'IMEI Changer (Quectel & Dell)'),
            E('div', { 'class': 'cbi-section' }, [
                E('p', 'Masukkan IMEI baru dan pilih jenis modem.'),
                E('input', { 'id': 'imei_input', 'class': 'cbi-input-text', 'placeholder': '15 Digit IMEI' }),
                E('select', { 'id': 'modem_type', 'class': 'cbi-input-select' }, [
                    E('option', { 'value': 'quectel' }, 'Quectel RM520N-GL'),
                    E('option', { 'value': 'dell' }, 'Dell DW5821e')
                ]),
                E('button', {
                    'class': 'btn cbi-button-apply',
                    'click': function() {
                        var imei = document.getElementById('imei_input').value;
                        var type = document.getElementById('modem_type').value;
                        // Logika panggil shell command di sini via uci/call
                        alert('Fitur ini memerlukan integrasi RPCD untuk eksekusi shell.');
                    }
                }, 'Ganti IMEI Sekarang')
            ])
        ]);
    }
});