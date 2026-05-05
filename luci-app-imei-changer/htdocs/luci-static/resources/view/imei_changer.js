'use strict';
'use ui';

var rpc = L.require('rpc');

// Daftarkan perintah shell sebagai fungsi RPC
var callSetImei = rpc.declare({
    object: 'file',
    method: 'exec',
    params: [ 'command', 'params' ],
    expect: { '': {} }
});

return L.view.extend({
    handleCheckModem: function(ev) {
        var logArea = document.getElementById('log_output');
        var type = document.getElementById('modem_type').value;

        logArea.value = "[Check] Meminta data dari modem via socat...\n";

        // Panggil fungsi RPC yang sudah didaftarkan
        return callSetImei('/usr/bin/set_imei', [ 'check', type ]).then(L.bind(function(res) {
            if (res && res.stdout) {
                logArea.value += res.stdout;
            } else {
                logArea.value += "Error: Tidak ada respon dari modem atau akses ditolak.";
            }
            logArea.scrollTop = logArea.scrollHeight;
        }, this)).catch(function(e) {
            logArea.value += "Kesalahan RPC: " + e.message;
        });
    },

    handleApply: function(ev) {
        var imei = document.getElementById('imei_input').value;
        var type = document.getElementById('modem_type').value;
        var logArea = document.getElementById('log_output');

        if (!imei || imei.length < 15) {
            alert('Masukkan 15 digit IMEI yang valid!');
            return;
        }

        logArea.value += "\n[Action] Mengirim perintah ganti IMEI...\n";

        return callSetImei('/usr/bin/set_imei', [ imei, type ]).then(L.bind(function(res) {
            if (res.stdout) logArea.value += res.stdout;
            logArea.scrollTop = logArea.scrollHeight;
        }, this));
    },

    render: function() {
        return E('div', { 'class': 'cbi-map' }, [
            E('h2', 'IMEI Changer (Quectel & Dell)'),
            E('div', { 'class': 'cbi-section' }, [
                E('p', 'Gunakan tombol di bawah untuk mengelola modem.'),
                E('div', { 'class': 'cbi-section-node' }, [
                    E('div', { 'class': 'cbi-value' }, [
                        E('label', { 'class': 'cbi-value-title' }, 'New IMEI'),
                        E('div', { 'class': 'cbi-value-field' }, [
                            E('input', { 'id': 'imei_input', 'class': 'cbi-input-text', 'placeholder': '15 Digit IMEI' })
                        ])
                    ]),
                    E('div', { 'class': 'cbi-value' }, [
                        E('label', { 'class': 'cbi-value-title' }, 'Modem Type'),
                        E('div', { 'class': 'cbi-value-field' }, [
                            E('select', { 'id': 'modem_type', 'class': 'cbi-input-select' }, [
                                E('option', { 'value': 'quectel' }, 'Quectel RM520N-GL'),
                                E('option', { 'value': 'dell' }, 'Dell DW5821e')
                            ])
                        ])
                    ])
                ]),
                E('div', { 'class': 'cbi-section-create' }, [
                    E('button', {
                        'class': 'btn cbi-button-action important',
                        'style': 'margin-right: 10px;',
                        'click': L.bind(this.handleCheckModem, this)
                    }, 'Cek Status Modem'),
                    E('button', {
                        'class': 'btn cbi-button-apply',
                        'click': L.bind(this.handleApply, this)
                    }, 'Ganti IMEI Sekarang')
                ]),
                E('h3', 'Process Log:'),
                E('textarea', {
                    'id': 'log_output',
                    'class': 'cbi-input-textarea',
                    'style': 'width:100%; height:250px; font-family:monospace; background:#000; color:#0f0; padding:10px;',
                    'readonly': 'readonly'
                })
            ])
        ]);
    }
});