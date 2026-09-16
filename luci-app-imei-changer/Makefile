include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-imei-changer
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_MAINTAINER:=lemi-aemi
PKG_LICENSE:=MIT

LUCI_TITLE:=LuCI interface for IMEI Changer
LUCI_DEPENDS:=+luci-base

include $(TOPDIR)/feeds/luci/luci.mk

# OpenWrt Build Package Definition
define Package/luci-app-imei-changer
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for IMEI Changer
  DEPENDS:=+luci-base
  PKG_ARCH:=all
endef

define Package/luci-app-imei-changer/description
  LuCI interface for IMEI Changer script.
endef

define Package/luci-app-imei-changer/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./etc/config/imei_changer $(1)/etc/config/imei_changer

	$(INSTALL_DIR) $(1)/usr/libexec
	$(INSTALL_BIN) ./usr/libexec/set_imei $(1)/usr/libexec/set_imei

	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./usr/share/luci/menu.d/luci-app-imei-changer.json $(1)/usr/share/luci/menu.d/luci-app-imei-changer.json

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./usr/share/rpcd/acl.d/luci-app-imei-changer.json $(1)/usr/share/rpcd/acl.d/luci-app-imei-changer.json

	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/modem
	$(INSTALL_DATA) ./www/luci-static/resources/view/modem/imei_changer.js $(1)/www/luci-static/resources/view/modem/imei_changer.js
endef

$(eval $(call BuildPackage,luci-app-imei-changer))
