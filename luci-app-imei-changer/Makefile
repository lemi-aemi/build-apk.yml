include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-imei-changer
PKG_VERSION:=1.0
PKG_RELEASE:=1
PKG_MAINTAINER:=LemiAemi

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-imei-changer
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for IMEI Changer (RM520N & DW5821e)
  DEPENDS:=+socat
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/luci-app-imei-changer/install
	# 1. Install script backend ke /usr/bin/set_imei
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/set_imei.sh $(1)/usr/bin/set_imei

	# 2. Install LuCI Menu JSON (Agar muncul di bawah kategori Modem)
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./files/luci-app-imei-changer.json $(1)/usr/share/luci/menu.d/luci-app-imei-changer.json

	# 3. Install RPCD ACL JSON (Izin akses untuk UI)
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./files/luci-app-imei-changer-acl.json $(1)/usr/share/rpcd/acl.d/luci-app-imei-changer.json

	# 4. Copy file konfigurasi sistem dari folder root (jika ada)
	if [ -d "./root" ] && [ "$$(ls -A ./root)" ]; then \
		$(CP) ./root/* $(1)/; \
	fi

	# 5. Copy file antarmuka web ke /www/ (jika ada folder htdocs)
	$(INSTALL_DIR) $(1)/www
	if [ -d "./htdocs" ] && [ "$$(ls -A ./htdocs)" ]; then \
		$(CP) ./htdocs/* $(1)/www/; \
	fi
endef

$(eval $(call BuildPackage,luci-app-imei-changer))
