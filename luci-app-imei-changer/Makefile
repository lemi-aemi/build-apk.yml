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
  DEPENDS:=+atinout
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/luci-app-imei-changer/install

    # Install JavaScript View (Sangat penting untuk ImmortalWrt 25.12)
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/modem/
	$(INSTALL_DATA) ./htdocs/luci-static/resources/view/modem/imei_changer.js $(1)/www/luci-static/resources/view/modem/imei_changer.js

	# 1. Install script backend (Tetap dari folder files jika itu lokasi scriptnya)
	$(INSTALL_DIR) $(1)/usr/bin/
	$(INSTALL_BIN) ./files/set_imei.sh $(1)/usr/bin/set_imei

	# 2. Copy seluruh struktur dari folder root
	# Ini otomatis akan membawa usr/share/luci/menu.d/ dan usr/share/rpcd/acl.d/
	# jika struktur folder di repositori Anda sudah benar.
	$(INSTALL_DIR) $(1)/etc/config/
	$(INSTALL_BIN) ./root/etc/config/imei_changer $(1)/etc/config/imei_changer

	# 3. Copy file antarmuka web ke
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d/
	$(INSTALL_BIN) ./usr/share/luci/menu.d/luci-app-imei-changer.json $(1)/usr/share/luci/menu.d/luci-app-imei-changer.json
	
	# 4. Copy file antarmuka web ke
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d/
	$(INSTALL_BIN) ./usr/share/rpcd/acl.d/luci-app-imei-changer.json $(1)/usr/share/rpcd/acl.d/luci-app-imei-changer.json
	
endef


$(eval $(call BuildPackage,luci-app-imei-changer))
