/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const { Clutter, St, Pango, GObject } = imports.gi;
const INDICATOR_ICON = 'mail-unread-symbolic';
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const MyIndicator = Me.imports.InboxScanner.MailExtension;


var MailExtension = GObject.registerClass(
class MailExtension extends PanelMenu.Button {
   _init(options, extension) {
		super._init(0.0, null, false);
    	this._icon = new St.Icon({
			icon_name: INDICATOR_ICON,
			style_class: 'system-status-icon'});

		this._iconBin = new St.Bin({ child: this._icon, x_fill: false, y_fill: false });
		
		this._counterLabel = new St.Label({ text: "0",
											x_align: Clutter.ActorAlign.CENTER,
											x_expand: true,
											y_align: Clutter.ActorAlign.CENTER,
											y_expand: true });
		
		this._counterBin = new St.Bin({ style_class: 'mailnag-counter',
										child: this._counterLabel,
										layout_manager: new Clutter.BinLayout() });
	
		this.add_actor(this._iconBin);
		this.add_actor(this._counterBin);
		this._counterBin.visible = false;
		
    
    }
    vfunc_allocate(box, flags) {
		super.vfunc_allocate(box, flags);
		
		// the iconBin should fill our entire box
		this._iconBin.allocate(box, flags);

		// get the allocation box of the indicator icon
		let iconBox = this._iconBin.child.first_child.get_allocation_box();
		// create a temporary box for calculating the counter allocation
		let childBox = new Clutter.ActorBox();

		let [minWidth, minHeight, naturalWidth, naturalHeight] = this._counterBin.get_preferred_size();
		let direction = this.get_text_direction();

		if (direction == Clutter.TextDirection.LTR) {
			// allocate on the right in LTR
			childBox.x1 = iconBox.x2 - (naturalWidth / 2);
			childBox.x2 = childBox.x1 + naturalWidth;
		} else {
			// allocate on the left in RTL
			childBox.x1 = iconBox.x1 - (naturalWidth / 2);
			childBox.x2 = childBox.x1 + naturalWidth;
		}

		childBox.y1 = iconBox.y2 - (naturalHeight / 2) - 1;
		childBox.y2 = childBox.y1 + naturalHeight;

		this._counterBin.allocate(childBox, flags);
		
		
    }
    setMails(CountMails) {
		//log(CountMails);
		let label = CountMails <= 99 ? CountMails.toString() : "...";
		this._counterLabel.set_text(label);
		if (CountMails > 0) {
			this._counterBin.visible = true;
			this._icon.opacity = 255;
		} else {
			this._counterBin.visible = false;
			this._icon.opacity = 223;
		}

		
	}

   
})
