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
	# Install JavaScript View
	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/modem/
	[ -f ./htdocs/luci-static/resources/view/modem/imei_changer.js ] && \
		$(INSTALL_DATA) ./htdocs/luci-static/resources/view/modem/imei_changer.js $(1)/www/luci-static/resources/view/modem/imei_changer.js || true

	# Install script backend
	$(INSTALL_DIR) $(1)/usr/bin/
	[ -f ./files/set_imei.sh ] && \
		$(INSTALL_BIN) ./files/set_imei.sh $(1)/usr/bin/set_imei || true

	# Install config
	$(INSTALL_DIR) $(1)/etc/config/
	[ -f ./root/etc/config/imei_changer ] && \
		$(INSTALL_BIN) ./root/etc/config/imei_changer $(1)/etc/config/imei_changer || true

	# Install Menu JSON
	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d/
	[ -f ./root/usr/share/luci/menu.d/luci-app-imei-changer.json ] && \
		$(INSTALL_BIN) ./root/usr/share/luci/menu.d/luci-app-imei-changer.json $(1)/usr/share/luci/menu.d/luci-app-imei-changer.json || true
	
	# Install ACL JSON
	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d/
	[ -f ./root/usr/share/rpcd/acl.d/luci-app-imei-changer.json ] && \
		$(INSTALL_BIN) ./root/usr/share/rpcd/acl.d/luci-app-imei-changer.json $(1)/usr/share/rpcd/acl.d/luci-app-imei-changer.json || true
endef


$(eval $(call BuildPackage,luci-app-imei-changer))
