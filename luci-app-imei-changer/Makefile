include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-imei-changer
PKG_VERSION:=1.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/luci-app-imei-changer
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=3. Applications
  TITLE:=LuCI support for IMEI Changer
  DEPENDS:=+socat
  PKGARCH:=all
endef

define Build/Compile
endef

define Package/luci-app-imei-changer/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/set_imei.sh $(1)/usr/bin/set_imei
	$(CP) -r ./root/* $(1)/
	$(CP) -r ./htdocs/* $(1)/www/
endef

$(eval $(call BuildPackage,luci-app-imei-changer))
