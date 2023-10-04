/* extension.js
 *
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

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Main = imports.ui.main;

let dateMenu = null;
let settings = null;
let banglaTime = null;
let updateClockId = 0;

function BanglaTime() {
    this.init();
}

BanglaTime.prototype = {
    init: function() {

        this.bangla_numbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "১০", "১১", "১২", "১৩", "১৪", "১৫", "১৬", "১৭", "১৮", "১৯", "২০", "২১", "২২", "২৩", "২৪", "২৫", "২৬", "২৭", "২৮", "২৯", "৩০", "৩১", "৩২", "৩৩", "৩৪", "৩৫", "৩৬", "৩৭", "৩৮", "৩৯", "৪০", "৪১", "৪২", "৪৩", "৪৪", "৪৫", "৪৬", "৪৭", "৪৮", "৪৯", "৫০", "৫১", "৫২", "৫৩", "৫৪", "৫৫", "৫৬", "৫৭", "৫৮", "৫৯", "৬০"];
        this.bangla_month = ["জানুয়ারী",  "ফেব্রুয়ারী",  "মার্চ",  "এপ্রিল",  "মে",  "জুন",  "জুলাই",  "অগাস্ট",  "সেপ্টেম্বর",  "অক্টোবর",  "নভেম্বর",  "ডিসেম্বর "];
        this.bangla_dayparts = ["সকাল", "দুপুর", "অপরাহ্ণ", " সন্ধ্যা", "রাত", "ভোর"];
        this.bangla_weekdays = ["সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার", "রবিবার"];

    },

    time: function(currentTime) {
        let hour = currentTime.get_hour();
        
        let daypart = null;
        if(hour >= 20 || hour <= 3) daypart = this.bangla_dayparts[4];
        else if(hour >= 4 && hour <= 6) daypart = this.bangla_dayparts[5];
        else if(hour >= 7 && hour <= 11) daypart = this.bangla_dayparts[0];
        else if(hour >= 12 && hour <= 14) daypart = this.bangla_dayparts[1];
        else if(hour >= 15 && hour <= 17) daypart = this.bangla_dayparts[2];
        else if(hour >= 18 && hour <= 19) daypart = this.bangla_dayparts[3];
        
        hour = hour % 12;
        if(hour == 0) hour = 12;
        
        let minute = this.bangla_numbers[currentTime.get_minute()];
        if(currentTime.get_minute() <= 9) minute = this.bangla_numbers[0] + minute;
        
        return daypart + " " + this.bangla_numbers[hour] + ":" + minute;
    },
    
    

    date: function(currentTime) {
        let month = currentTime.get_month();
        let day = currentTime.get_day_of_month();
        let weekday = this.bangla_weekdays[currentTime.get_day_of_week() - 1];
        return weekday + " " + this.bangla_numbers[day] + " " + this.bangla_month[month - 1];
    }
};

function updateClockAndDate() {
    let currentTime = GLib.DateTime.new_now(dateMenu._clock.get_timezone());
    
    let clockStr = banglaTime.time(currentTime);
    if (settings.get_boolean('clock-show-date')) {
        clockStr += ", " + banglaTime.date(currentTime);
    }
    dateMenu._clockDisplay.text = clockStr;
}

function init() {}

function enable() {
    dateMenu = Main.panel.statusArea['dateMenu'];
    if (!dateMenu) {
        return;
    }
    settings = new Gio.Settings({ schema: 'org.gnome.desktop.interface' });
    banglaTime = new BanglaTime();
    if (updateClockId !== 0) {
        dateMenu._clock.disconnect(updateClockId);
    }
    updateClockId = dateMenu._clock.connect('notify::clock', updateClockAndDate.bind(dateMenu));
    updateClockAndDate();
}

function disable() {
    
    if (updateClockId !== 0) {
        dateMenu._clock.disconnect(updateClockId);
        updateClockId = 0;
    }
    dateMenu._clockDisplay.text = dateMenu._clock.clock;
    delete banglaTime;
    banglaTime = null;
    delete settings;
    settings = null;
    dateMenu = null;
}


