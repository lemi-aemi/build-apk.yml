'use strict';
'require dom';
'require fs';
'require ui';
'require uci';
'require view';
'require form';

return view.extend({
    handleAction: function(action) {
        var log = document.getElementById('log_output');
        var modemType = document.getElementById('modem_type').value;
        var imeiVal = document.getElementById('imei_val') ? document.getElementById('imei_val').value : '';
        
        log.style.display = '';
        log.value = "[Action] Menjalankan " + action + "...\n";

        // Mengambil port dari config imei_changer via uci
        return uci.load('imei_changer').then(function() {
            var port = uci.get('imei_changer', 'main', 'port') || '/dev/ttyUSB2';
            log.value += "[Info] Menggunakan port: " + port + "\n";
            
            var params = [action, modemType, port];
            if (action === 'change') params.push(imeiVal);

            return fs.exec('/usr/bin/set_imei', params);
        }).then(function(res) {
            log.value += res.stdout || res.stderr || "Proses selesai.";
        }).catch(function(e) {
            ui.addNotification(null, E('p', [e.message]), 'error');
        });
    },

    load: function() {
        return Promise.all([
            uci.load('imei_changer'),
            L.resolveDefault(fs.list('/dev'), [])
        ]);
    },

    render: function(loadResults) {
        var dev_list = loadResults[1] || [];

        // Bagian Konfigurasi (UCI Map)
        var m = new form.Map('imei_changer', _('IMEI Changer Configuration'), _('Konfigurasi port dan perintah modem.'));
        var s = m.section(form.NamedSection, 'main', 'imei_changer');

        var o = s.option(form.ListValue, 'port', _('Modem Port'));
        o.rmempty = false;
        dev_list.forEach(function(dev) {
            if (dev.name.match(/^ttyUSB|^ttyACM/)) {
                o.value('/dev/' + dev.name);
            }
        });

        s.option(form.Value, 'cmd_check', _('Command Cek IMEI'));
        s.option(form.Value, 'cmd_quectel', _('Command Quectel'));
        s.option(form.Value, 'cmd_dell', _('Command Dell'));

        // Bagian Tool (Ganti IMEI)
        var tool_node = E('div', { 'class': 'cbi-section' }, [
            E('h3', _('IMEI Tool')),
            E('div', { 'class': 'cbi-value' }, [
                E('label', { 'class': 'cbi-value-title' }, _('Modem Type')),
                E('div', { 'class': 'cbi-value-field' }, [
                    E('select', { 'id': 'modem_type', 'class': 'cbi-input-select' }, [
                        E('option', { 'value': 'quectel' }, 'Quectel RM520N-GL'),
                        E('option', { 'value': 'dell' }, 'Dell DW5821e')
                    ])
                ])
            ]),
            E('div', { 'class': 'cbi-value' }, [
                E('label', { 'class': 'cbi-value-title' }, _('IMEI Baru')),
                E('div', { 'class': 'cbi-value-field' }, [
                    E('input', { 'id': 'imei_val', 'type': 'text', 'class': 'cbi-input-text', 'placeholder': '15 digit IMEI' })
                ])
            ]),
            E('div', { 'class': 'cbi-value' }, [
                E('button', { 
                    'class': 'cbi-button cbi-button-action important',
                    'click': ui.createHandlerFn(this, 'handleAction', 'check')
                }, [ _('Cek Status IMEI') ]),
                E('button', { 
                    'class': 'cbi-button cbi-button-save',
                    'style': 'margin-left: 10px;',
                    'click': ui.createHandlerFn(this, 'handleAction', 'change')
                }, [ _('Update IMEI') ])
            ]),
            E('textarea', {
                'id': 'log_output',
                'class': 'cbi-input-textarea',
                'style': 'width:100%; height:200px; background:#000; color:#0f0; font-family:monospace; margin-top:10px; display:none;',
                'readonly': 'readonly'
            })
        ]);

        return E('div', {}, [
            m.render(),
            tool_node
        ]);
    }
});
