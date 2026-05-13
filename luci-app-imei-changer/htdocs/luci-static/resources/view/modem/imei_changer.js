'use strict';
'use ui';

var fs = L.require('fs');
var uci = L.require('uci');

return L.view.extend({
    load: function() {
        return Promise.all([
            uci.load('imei_changer').catch(function() { return null; }),
            L.resolveDefault(fs.list('/dev'), [])
        ]);
    },

    handleAction: function(action) {
        var log = document.getElementById('log_output');
        var modemType = document.getElementById('modem_type').value;
        var imeiVal = document.getElementById('imei_val') ? document.getElementById('imei_val').value : '';
        
        log.value = "[Action] Menjalankan " + action + "...\n";

        var params = [action, modemType];
        if (action === 'change') params.push(imeiVal);

        return fs.exec('/usr/bin/set_imei', params).then(function(res) {
            log.value += res.stdout || res.stderr || "Proses selesai.";
        }).catch(function(e) {
            log.value += "Error: " + e.message;
        });
    },

    render: function(data) {
        var dev_list = data[1] || [];
        
        // Buat container utama
        var m = new L.ui.Map('imei_changer', 'IMEI Changer LemWRT', 'Konfigurasi port dan ganti IMEI modem.');
        var s = m.section(L.ui.NamedSection, 'main', 'imei_changer');

        // Opsi Port (Langsung muncul di atas)
        var o = s.option(L.ui.ListValue, 'port', 'Modem Port', 'Pilih port komunikasi modem yang aktif.');
        o.value('/dev/ttyUSB2');
        for (var i = 0; i < dev_list.length; i++) {
            if (dev_list[i].name.match(/^ttyUSB|^ttyACM/)) {
                o.value('/dev/' + dev_list[i].name);
            }
        }

        // Section untuk Tool Ganti IMEI (Manual HTML agar tidak error library)
        var tool_node = E('div', { 'class': 'cbi-section' }, [
            E('h3', 'AT Command Tool'),
            E('div', { 'class': 'cbi-value' }, [
                E('label', { 'class': 'cbi-value-title' }, 'Modem Type'),
                E('div', { 'class': 'cbi-value-field' }, [
                    E('select', { 'id': 'modem_type', 'class': 'cbi-input-select' }, [
                        E('option', { 'value': 'quectel' }, 'Quectel RM520N-GL'),
                        E('option', { 'value': 'dell' }, 'Dell DW5821e')
                    ])
                ])
            ]),
            E('div', { 'class': 'cbi-value' }, [
                E('label', { 'class': 'cbi-value-title' }, 'IMEI Baru'),
                E('div', { 'class': 'cbi-value-field' }, [
                    E('input', { 'id': 'imei_val', 'type': 'text', 'class': 'cbi-input-text', 'placeholder': '15 Digit IMEI' })
                ])
            ]),
            E('div', { 'class': 'cbi-section-create' }, [
                E('button', { 
                    'class': 'btn cbi-button-action important', 
                    'click': L.bind(this.handleAction, this, 'check') 
                }, 'Cek Status IMEI'),
                E('button', { 
                    'class': 'btn cbi-button-save', 
                    'style': 'margin-left:10px;', 
                    'click': L.bind(this.handleAction, this, 'change') 
                }, 'Update IMEI Sekarang')
            ]),
            E('textarea', { 
                'id': 'log_output', 
                'class': 'cbi-input-textarea', 
                'style': 'width:100%; height:150px; background:#000; color:#0f0; margin-top:10px; font-family:monospace; padding:10px;', 
                'readonly': 'readonly' 
            })
        ]);

        return E('div', { 'class': 'cbi-map' }, [
            m.render(),
            tool_node
        ]);
    }
});
