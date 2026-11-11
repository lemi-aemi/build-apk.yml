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
            }),
            fs.list('/etc/config/imei_backups').catch(function() { return []; })
        ]);
    },

    render: function(data) {
        var devs = data[1]; 
        var backupFiles = data[2] || [];
        
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
            var cmd = customCmd || '';

            if (!port && action !== 'load_backup') {
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
                // Modem Type
                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, 'Modem Type'),
                    E('div', { 'class': 'cbi-value-field' }, [
                        E('select', { 'id': 'modem_type', 'class': 'cbi-input-select' }, [
                            E('option', { 'value': 'quectel' }, 'Quectel RM520N-GL'),
                            E('option', { 'value': 'dell' }, 'Dell DW5821e')
                        ])
                    ])
                ]),

                // Port Modem
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

                // Custom AT Command
                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, 'Custom AT Command'),
                    E('div', { 'class': 'cbi-value-field', 'style': 'display: flex; gap: 8px; align-items: center;' }, [
                        E('input', { 
                            'id': 'custom_at_cmd', 
                            'class': 'cbi-input-text', 
                            'placeholder': 'Contoh: AT+CFUN=1,1',
                            'style': 'flex: 1;'
                        }),
                        E('button', {
                            'class': 'btn cbi-button-apply',
                            'click': function() {
                                var cmdVal = document.getElementById('custom_at_cmd').value;
                                handleAction('custom', cmdVal);
                            }
                        }, 'AT Send'),
                        E('button', {
                            'class': 'btn cbi-button-reset',
                            'style': 'background-color: #d9534f !important; color: white !important; border: none;',
                            'click': function() {
                                handleAction('cfun');
                            }
                        }, 'AT+CFUN=1,1')
                    ])
                ]),

                // IMEI Baru + Back-UP IMEI
                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, 'IMEI Baru'),
                    E('div', { 'class': 'cbi-value-field', 'style': 'display: flex; gap: 8px; align-items: center;' }, [
                        E('input', { 
                            'id': 'imei_val', 
                            'class': 'cbi-input-text', 
                            'placeholder': '15 digit IMEI',
                            'style': 'flex: 1;'
                        }),
                        E('button', {
                            'class': 'btn cbi-button-neutral',
                            'style': 'background-color: #0275d8 !important; color: white !important; border: none;',
                            'click': function() {
                                handleAction('backup').then(function() {
                                    setTimeout(function() { location.reload(); }, 1000);
                                });
                            }
                        }, 'Back-UP IMEI')
                    ])
                ]),

                // Dropdown Select IMEI Backup
                E('div', { 'class': 'cbi-value' }, [
                    E('label', { 'class': 'cbi-value-title' }, 'Pilih Backup IMEI'),
                    E('div', { 'class': 'cbi-value-field', 'style': 'display: flex; gap: 8px; align-items: center;' }, [
                        E('select', { 'id': 'backup_select', 'class': 'cbi-input-select', 'style': 'flex: 1;' }, 
                            backupFiles.length > 0 ? backupFiles.map(function(file) {
                                // Menampilkan nama tanpa .txt di UI
                                var cleanName = file.name.replace(/\.txt$/, '');
                                return E('option', { 'value': file.name }, cleanName);
                            }) : [ E('option', { 'value': '' }, '-- Tidak ada file backup --') ]
                        ),
                        E('button', {
                            'class': 'btn cbi-button-action',
                            'style': 'background-color: #5cb85c !important; color: white !important; border: none;',
                            'click': function() {
                                var selectedFile = document.getElementById('backup_select').value;
                                if (!selectedFile) {
                                    ui.addNotification(null, E('p', {}, 'Pilih file backup terlebih dahulu!'), 'error');
                                    return;
                                }
                                fs.exec('/usr/libexec/set_imei', ['load_backup', '', '', '', selectedFile]).then(function(res) {
                                    if (res.stdout) {
                                        var loadedIMEI = res.stdout.trim();
                                        document.getElementById('imei_val').value = loadedIMEI;
                                        appendLog('[OK] Loaded IMEI ' + loadedIMEI + ' dari file ' + selectedFile);
                                    }
                                });
                            }
                        }, 'Load IMEI')
                    ])
                ]),

                // Tombol Cek Status IMEI & Update IMEI
                E('div', { 'class': 'cbi-value' }, [
                    E('div', { 'class': 'cbi-value-field', 'style': 'width: 100%; display: flex; flex-direction: column; gap: 8px;' }, [
                        E('button', {
                            'class': 'btn cbi-button-action primary',
                            'style': 'width: 100%;',
                            'click': function() { handleAction('check'); }
                        }, 'Cek Status IMEI'),
                        E('button', {
                            'class': 'btn cbi-button-save',
                            'style': 'width: 100%;',
                            'click': function() { handleAction('update'); }
                        }, 'Update IMEI')
                    ])
                ]),
                E('div', { 'style': 'margin-top:20px' }, [ logBox ])
            ])
        ]);
    }
});
