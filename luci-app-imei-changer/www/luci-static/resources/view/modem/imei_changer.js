'use strict';
'require fs';
'require ui';
'require uci';
'require view';

return view.extend({
    load: function() {
        return Promise.all([
            uci.load('imei_changer'),
            fs.list('/dev').then(function(devs) {
                return devs.filter(function(dev) {
                    return dev.name.match(/^ttyUSB/) || dev.name.match(/^cdc-wdm/) || dev.name.match(/^ttyACM/);
                });
            })
        ]);
    },

    render: function(data) {
        var devs = data[1]; 
        
        var logBox = E('textarea', {
            'id': 'log_output',
            'class': 'cbi-input-textarea',
            'style': 'width:100%; height:300px; font-family:monospace; background:#000; color:#0f0; padding:10px;',
            'readonly': 'readonly'
        }, '[Info] Siap menjalankan perintah...\n');

        var appendLog = function(msg) {
            logBox.value += msg + '\n';
            logBox.scrollTop = logBox.scrollHeight;
        };

        var handleAction = function(action, customCmd) {
            var modemType = document.getElementById('modem_type').value;
            var imeiVal = document.getElementById('imei_val').value;
            var port = document.getElementById('modem_port').value;
            var cmd = customCmd || ''; // Sekarang customCmd sudah terdefinisi

            if (!port) {
                ui.addNotification(null, E('p', {}, 'Pilih port modem terlebih dahulu!'), 'error');
                return;
            }

            appendLog('[Action] Menjalankan ' + action + (cmd ? ' (' + cmd + ')' : '') + ' pada ' + modemType + ' via ' + port);

            return fs.exec('/usr/libexec/set_imei', [action, modemType, port, imeiVal, cmd])
                .then(function(res) {
                    if (res.stdout) appendLog(res.stdout);
                    if (res.stderr) appendLog('[Stderr] ' + res.stderr);
                })
                .catch(function(err) {
                    appendLog('[Error] ' + err.message);
                });
        };

        return E('div', { 'class': 'cbi-map' }, [
            E('h2', {}, 'IMEI Tool - LemWrt Custom'),
            E('div', { 'class': 'cbi-section' }, [
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
                    E('label', { 'class': 'cbi-value-title' }, 'Port Modem'),
                    E('div', { 'class': 'cbi-value-field' }, [
                        E('select', { 'id': 'modem_port', 'class': 'cbi-input-select' }, 
                            devs.map(function(dev) {
                                return E('option', { 'value': '/dev/' + dev.name }, '/dev/' + dev.name);
                            })
                        )
                    ])
                ]), 


                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, 'Custom AT Command'),
                    E('div', { 'class': 'cbi-value-field' }, [
                        E('input', { 
                            'id': 'custom_at_cmd', 
                            'class': 'cbi-input-text', 
                            'placeholder': 'Contoh: AT+CFUN=1,1',
                            'style': 'width: 70%; display: inline-block; margin-right: 10px;'
                        }),
                        E('button', {
                            'class': 'btn cbi-button-apply',
                            'click': function() {
                                var cmdVal = document.getElementById('custom_at_cmd').value;
 
                                handleAction('custom', cmdVal);
                            }
                        }, 'AT Send')
                    ])
                ]),


                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, 'IMEI Baru'),
                    E('div', { 'class': 'cbi-value-field' }, [
                        E('input', { 'id': 'imei_val', 'class': 'cbi-input-text', 'placeholder': '15 digit IMEI' })
                    ])
                ]),


                E('div', { 'class': 'cbi-value' }, [
                    E('button', {
                        'class': 'btn cbi-button-action primary',
                        'click': function() { handleAction('check'); }
                    }, 'Cek Status IMEI'),
                    ' ',
                    E('button', {
                        'class': 'btn cbi-button-save',
                        'click': function() { handleAction('update'); }
                    }, 'Update IMEI')
                ]),
                E('div', { 'style': 'margin-top:20px' }, [ logBox ])
            ])
        ]);
    }
});