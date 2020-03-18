"use strict";
// Öffnet den anonymen Namespace
(() => {

  // Erste Funktion die ausgelöst wird beim Seitenaufruf
  window.addEventListener("load", function () {
    // Definiert das Custom-Element um es von überall erstellen zu können
    // Läd die Loginseite 
    window.customElements.define('my-favorite', FavoriteBox);
    LOGIN.load();
  });
  // ------------------Basisfunktionen--------------------------
  function $(id) {
    return document.getElementById(id);
  }

  // Löscht alle Elemente des Bodys der HTML Seite 
  function deleteAllBodyChildren() {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  }
  // Löscht alle Elemente des Bodys außer den Header
  function keepHeaderDeleteRest() {
    var element = document.getElementsByClassName("bodyTemplate")[0];
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }


  // Objekt LOGIN zur Registrierung und Login
  let LOGIN = {
    // Die Funktion load() erzeugt per DOM Skripting
    // alle HTML Elemente der Seite
    load: function () {
      var wrapperLogin = document.createElement("div");
      var box = document.createElement("div");
      box.className = "box";
      var headline = document.createElement("h1");
      headline.appendChild(document.createTextNode("Prophy"));
      var inputUsername = document.createElement("input");
      inputUsername.setAttribute("type", "text");
      inputUsername.id = "username_input";
      inputUsername.placeholder = "Username";
      var inputPassword = document.createElement("input");
      inputPassword.setAttribute("type", "password");
      inputPassword.id = "password_input";
      inputPassword.placeholder = "Password";
      var loginButton = document.createElement("input");
      loginButton.setAttribute("type", "button");
      loginButton.id = "button_input";
      loginButton.value = "Login";
      box.appendChild(headline);
      box.appendChild(inputUsername);
      box.appendChild(inputPassword);
      box.appendChild(loginButton);
      wrapperLogin.appendChild(box);

      // Bevor es dem Body hinzugefügt wird, werden einmal
      // alle Elemente gelöscht
      deleteAllBodyChildren();
      document.body.appendChild(wrapperLogin);
      // speichert Inputfelder in Variablen und gibt den Login-Button
      // einen Eventlistener 
      LOGIN.initialize();
    },
    initialize: function () {
      var username_input = $("username_input");
      var password_input = $("password_input");
      var button_input = $("button_input");
      // Erst beim Klick des Login-Buttons wird die Funktion ausgelöst
      button_input.addEventListener("click", LOGIN.clickevent_submitbutton);
    },
    // Ruft die Funktion try des LOGIN´s auf, die für die Benutzerdatenvalidierung
    // zuständig ist
    clickevent_submitbutton: function () {
      LOGIN.try($("username_input").value, $("password_input").value);
    },

    // Überprüft die eingegebenen Daten im Login
    try: function (username, password) {
      var button = $("button_input");

      // Wenn kein Username oder Passwort eingeben wurde, soll ein 
      // Error angezeigt werden
      if (username == "" || password == "") {
        displayErrorOnButton(button, "#2ecc71", "#35424a");
      } else {
        // Falls der Username noch nicht vergeben wurde wird ein neuer User erstellt
        if (WEBSTORAGE.checkUserEmpty(username)) {
          ACCOUNT.new(username, password);
          ACCOUNT.username = username;
          // Läd die Home-Seite
          HOME.load();
        } else if (WEBSTORAGE.checkPasswordAccess(username, password)) {

          // Falls der Username bereits existiert, wird das Passwort zum
          // Username im LocalStorage überprüft
          ACCOUNT.username = username;

          // Läd die Home-Seite
          HOME.load();
        } else {
          // Andernfalls wird nur ein Error ausgegeben
          displayErrorOnButton(button, "#2ecc71", "#35424a");
        }
      }
    }
  };
  // Objekt für die Home-Seite
  let HOME = {

    // Erstellt die HTML Elemente per DOM-Skript
    load: function () {

      // Zuerst werden alle Elemente des Bodys gelöscht
      deleteAllBodyChildren();

      var header = document.createElement("header");
      header.id = "header";
      var headline = document.createElement("h2");
      headline.id = "branding";
      headline.appendChild(document.createTextNode("Prophy Webapplication"));
      var nav = document.createElement("nav");
      var navigationArray = ["overview", "favorites", "settings", "logout"];
      var navigationText = [
        "Übersicht",
        "Favoriten",
        "Einstellungen",
        "Abmelden"
      ];
      for (let i = 0; i < navigationArray.length; i++) {
        var navigationElement = document.createElement("div");
        navigationElement.className = "navigationElement";
        navigationElement.id = navigationArray[i];
        navigationElement.textContent = navigationText[i];
        nav.appendChild(navigationElement);
      }
      header.appendChild(headline);
      header.appendChild(nav);
      var status = document.createElement("div");
      status.id = "status";
      header.appendChild(status);
      document.body.appendChild(header);

      // Informationen über Ort
      var bodyWrapper = document.createElement("div");
      bodyWrapper.className = "bodyTemplate";

      // Suchleiste für Openweathernet request
      var searchLocationInput = document.createElement("input");
      searchLocationInput.id = "searchInput";
      searchLocationInput.placeholder =
        "...Stadt,Koordinate oder Postleitzahl...";
      var searchLocationButton = document.createElement("button");
      searchLocationButton.id = "searchButton";
      searchLocationButton.textContent = "Suchen";

      bodyWrapper.appendChild(searchLocationInput);
      bodyWrapper.appendChild(searchLocationButton);

      var forecastWrapper = document.createElement("div");
      forecastWrapper.id = "forecastWrapper";

      var hourChangeLeft = document.createElement("div");
      hourChangeLeft.className = "hourChangeElement";
      hourChangeLeft.textContent = "-3 Stunden";
      forecastWrapper.appendChild(hourChangeLeft);

      for (let i = 0; i < 5; i++) {
        var forecastbox = document.createElement("div");
        forecastbox.className = "forecastbox";
        forecastWrapper.appendChild(forecastbox);
      }
      var hourChangeRight = document.createElement("div");
      hourChangeRight.className = "hourChangeElement";
      hourChangeRight.textContent = "+3 Stunden";
      forecastWrapper.appendChild(hourChangeRight);

      bodyWrapper.appendChild(forecastWrapper);

      var informationWrapper = document.createElement("div");
      informationWrapper.className = "informationWrapper";

      var information = document.createElement("div");
      information.className = "information";

      var location = document.createElement("div");
      var weather = document.createElement("div");
      var imgIcon = document.createElement("img");
      var temperatur = document.createElement("span");
      var description = document.createElement("div");
      var time = document.createElement("div");
      var windspeed = document.createElement("div");
      var airpressure = document.createElement("div");
      var winddirection = document.createElement("div");
      var cloudiness = document.createElement("div");
      var sunset = document.createElement("div");
      var sunrise = document.createElement("div");
      var humidity = document.createElement("div");

      location.id = "location_value";
      weather.id = "weather";
      imgIcon.id = "iconID";
      temperatur.id = "temperatur_value";
      description.id = "description_value";
      time.id = "time_value";
      windspeed.id = "windspeed_value";
      airpressure.id = "airpressure_value";
      winddirection.id = "winddirection_value";
      cloudiness.id = "cloudiness_value";
      sunset.id = "sunset_value";
      sunrise.id = "sunrise_value";
      humidity.id = "humidity_value";

      weather.appendChild(imgIcon);
      information.appendChild(location);
      weather.appendChild(temperatur);
      information.appendChild(weather);
      information.appendChild(description);
      information.appendChild(time);
      information.appendChild(humidity);
      information.appendChild(windspeed);
      information.appendChild(winddirection);
      information.appendChild(airpressure);
      information.appendChild(cloudiness);
      information.appendChild(sunset);
      information.appendChild(sunrise);

      informationWrapper.appendChild(information);
      bodyWrapper.appendChild(informationWrapper);
      document.body.appendChild(bodyWrapper);

      HOME.initialize(); // Gibt den Elementen der Home-Seite events
      FORECAST.initialize(); //  Gibt den Elementen des Forecasts events
      GEOLOCATION.request();  // Geolocation API request
      BROADCAST.load(); // Versucht sich zum Broadcastserver zu verbinden
    },

    initialize: function () {
      // Bei einem Klick auf die Überschrift wird die Home-Seite erzeugt
      $("branding").addEventListener("click", function () {
        HOME.load();
      });
      // Bei einem Klick auf den Suchbutton wird die nach dem Ort gesucht
      $("searchButton").addEventListener("click", function () {
        var value = $("searchInput").value;
        if (value != "") {
          // Gibt die Value des Suchinputs mit
          OPENWEATHERNET.requestToday(value);
        }
      });
      // Bei einem Klick auf das Übersichts-Feld wird die Übersicht dargestellt
      $("overview").addEventListener("click", function () {
        OVERVIEW.load();
      });
      // Bei einem Klick auf die Favoriten werden die Favoriten angezeigt
      $("favorites").addEventListener("click", function () {
        HOME.favorites.loadfavorites();
      });
      // Bei einem Klick auf die Einstellungen werden die Einstellungen angezeigt
      $("settings").addEventListener("click", function () {
        SETTINGS.load();
      });
      // Bei einem Klick auf Abmelden wird die Login-Seite angezeigt
      $("logout").addEventListener("click", function () {
        LOGIN.load();
      });
    }
  };
  HOME.search = {
    // Überprüft ob es sich um eine Koordinate handelt
    // Falls ein Komma vorliegt, ist es eine Koordinate
    getCoordinates: function (input) {
      if (input == null) {
        return false;
      }
      var result = false;
      for (let i = 0; i < input.length; i++) {
        if (input.charAt(i) == ",") {
          result = true;
        }
      }
      return result;
    },
    // Falls keine Zahl im String zu finden ist,
    // wird die Eingabe als Ortsname behandelt
    getName: function (input) {
      if (input == null) {
        return false;
      }
      var result = true;
      var count = 0;
      while (result && count < input.length) {
        if ("0123456789".includes(input.charAt(count))) {
          result = false;
        } else {
          count++;
        }
      }
      return result;
    },
    // Falls die Länge des Strings minimal 4 und maximal 10 
    // Chars entspricht und der String nur aus Zahlen besteht,
    // handelt es sich um eine Postleitzahl
    getPostcode: function (input) {
      if (input == null) {
        return false;
      }
      var result = true;
      if (input.length > 4 && input.length <= 10) {
        var count = 0;
        while (count < input.length && result) {
          if ("0123456789".includes(input.charAt(count))) {
            count++;
          } else {
            result = false;
          }
        }
      } else {
        result = false;
      }
      return result;
    }
  };
  HOME.information = {

    // Per DOM Ansprache werden die Informationen der Home-Seite geupdatet und notfalls
    // konvertiert zum richtigen Format
    update: function () {
      $("location_value").innerText = POSITION.name + ", " + POSITION.country;
      $("temperatur_value").innerText = Math.floor(parseInt(POSITION.temperatur)) + "°";
      // Konvertiert die Zeit zum richtigen Format
      $("time_value").innerText = "Zeitpunkt: " + CONVERT.date(Math.round(+new Date() / 1000), "hour") + " Uhr";
      $("sunrise_value").innerText = "Sonnenaufgang " + CONVERT.date(POSITION.sunrise, "hour") + " Uhr";
      $("sunset_value").innerText = "Sonnenuntergang " + CONVERT.date(POSITION.sunset, "hour") + " Uhr";
      $("windspeed_value").innerText = "Windgeschwindigkeit " + POSITION.windspeed + " m/s";
      // Erstellt zusätzlich einen Pfeil für die Windrichtung
      $("winddirection_value").innerText = "Windrichtung: " + CONVERT.deg_to_Direction(POSITION.winddirection);
      $("description_value").innerText = POSITION.description;
      $("cloudiness_value").innerText = "Bewölkung: " + POSITION.cloudiness + "%";
      $("airpressure_value").innerText = "Luftdruck: " + POSITION.airpressure + " hPa";
      $("humidity_value").innerText = "Feuchtigkeit: " + POSITION.humidity + " %";

      // Erzeugt das Bild der Anwort der Openweathernet API
      var iconUrl = `http://openweathermap.org/img/w/${POSITION.icon}.png`;
      var imgElement = document.createElement("img");
      imgElement.className = "iconRequest";
      imgElement.id = "iconID";
      imgElement.setAttribute("src", iconUrl);
      var wrapper = $("weather");
      wrapper.replaceChild(imgElement, $("iconID"));

      // Wenn alle Daten dargestellt worden sind,
      // wird nun der Forecast der Stadt angefordert und dann abgespeichert
      OPENWEATHERNET.requestForecast(POSITION.name);

    },
    updateWhenForecast: function (pack) {
      // Beim Klicken der verschiedenen Forecast-Buttons wird immer der gewählte Tag
      // zu gewählten Stunde angezeigt
      $("location_value").innerText = POSITION.name + ", " + POSITION.country;
      $("temperatur_value").innerText = Math.floor(parseInt(pack.main.temp)) + "°";
      $("time_value").innerText = "Zeitpunkt: " + CONVERT.date(pack.dt, "hour") + " Uhr";
      // Beim request an die API wird beim Forecast keine Informationen über Sonnenaufgang und
      // Sonnenuntergang übermittelt, deswegen werden diese entleert.
      $("sunrise_value").innerText = "";
      $("sunset_value").innerText = "";
      $("windspeed_value").innerText = "Windgeschwindigkeit " + pack.wind.speed + " m/s";
      $("winddirection_value").innerText = "Windrichtung: " + CONVERT.deg_to_Direction(pack.wind.deg);
      $("description_value").innerText = pack.weather[0].description;
      $("cloudiness_value").innerText = "Bewölkung: " + pack.clouds.all + "%";
      $("humidity_value").innerText = "Feuchtigkeit: " + pack.main.humidity + " %";

      // Bild wird dargestellt
      var iconUrl = `http://openweathermap.org/img/w/${pack.weather[0].icon}.png`;
      var imgElement = document.createElement("img");
      imgElement.className = "iconRequest";
      imgElement.id = "iconID";
      imgElement.setAttribute("src", iconUrl);
      var wrapper = $("weather");
      wrapper.replaceChild(imgElement, $("iconID"));

    }
  };
  HOME.favorites = {
    // Läd die Favoriten-Seite
    loadfavorites: function () {
      // Löscht alle Elemente des Bodys außer dem Header
      keepHeaderDeleteRest();
      var parent = document.getElementsByClassName("bodyTemplate")[0];
      var favorites = ACCOUNT.getFavorite();
      var favoriteWrapper = document.createElement("div");
      favoriteWrapper.id = "favoriteWrapper";

      // Erzeugt das Custom-Element FavoriteBox 
      // Eingabeparameter ist der Name des Ortes und das parent-Element
      for (let i = 0; i < favorites.length; i++) {
        favoriteWrapper.appendChild(new FavoriteBox(favorites[i], favoriteWrapper));
      }
      // Fügt der Seite die Liste an Favoriten hinzu
      parent.appendChild(favoriteWrapper);
    }
  };
  // Das Objekt POSITION speichert die zuletzt gesuchten/angeforderten Daten des Ortes,
  // um sie nicht erneut abzufragen per Openweathernet Request, sondern diese lokal zu speichern
  let POSITION = {
    name: "",
    country: "",
    sunrise: "",
    sunset: "",
    temperatur: "",
    windspeed: "",
    winddirection: "",
    description: "",
    cloudiness: "",
    airpressure: "",
    icon: "",
    forecastEntrys: "", // Daten über die nächsten 5 Tage in einem Array gespeichert
    humidity: "",
    // Wenn eine Antwort der OPW API kommt, werden die Informationen zuerst in dieses Objekt 
    // geschrieben

    // Die Funktion speichert die ankommenden Daten
    updatePostition: function (pack) {
      // Falls kein richtigen JSON-Packet ankommt,
      // wird nichts getan
      if (pack != null) {
        try {
          POSITION.name = pack.name;
          POSITION.country = pack.sys.country;
          POSITION.sunrise = pack.sys.sunrise;
          POSITION.sunset = pack.sys.sunset;
          POSITION.temperatur = pack.main.temp;
          POSITION.windspeed = pack.wind.speed;
          POSITION.winddirection = pack.wind.deg;
          POSITION.description = pack.weather[0].description;
          POSITION.cloudiness = pack.clouds.all;
          POSITION.airpressure = pack.main.pressure;
          POSITION.icon = pack.weather[0].icon;
          POSITION.humidity = pack.main.humidity;
          OVERVIEW.temperaturArray[0] = POSITION.temperatur;
          OVERVIEW.rainfallArray[0] = POSITION.humidity;
          OVERVIEW.cloudinessArray[0] = POSITION.cloudiness;
        } catch (e) { }
      }
    }
  };
  // Objekt um den Forecast der Home-Seite zu erzeugen
  let FORECAST = {
    index: 0, // Stelle an der momentan im Forecastarray (forecastEntrys) ausgelesen wird
    hourIndex: 0, // Stelle an der Stelle index im Forecastarray

    initialize: function () {
      // Zuerst wird auf der Home-Seite die Tage berechnet, die Angezeigt und Anklickbar sein sollen
      var time = new Date();
      FORECAST.index = 0;
      FORECAST.hourIndex = 0;
      var boxes = document.getElementsByClassName("forecastbox");
      for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        box.value = i;
        // Berechnet den Tag und addiert einen Tag auf diesen, um das
        // Datum von "Morgen" herauszufinden. 
        let add = 1;
        if (i == 0) {
          // An der Stelle 0 soll nichts ausrechnet werden, sondern stattdessen
          // die Box als selected makiert sein
          add = 0;
          box.style.backgroundColor = "#5693C0";
        }
        // Gibt jeder Box ein Datum (Tag,Monat)
        box.textContent = CONVERT.date(
          Math.round(time.setDate(time.getDate() + add) / 1000),
          "day"
        );
        box.addEventListener("click", function () {
          // Überprüft ob der selected Button, nocheinmal gedrückt wird
          if (FORECAST.index != box.value) {
            // Ändert die Farbe des ne geklickten Buttons um diesen als
            // selected darzustellen
            FORECAST.updateBoxColor(box.value);

            // Stellt den Index wieder auf 0, weil immer die erste Stunde eines Tages
            // angezeigt werden soll beim Aufruf (=2am)
            FORECAST.hourIndex = 0;

            if (box.value == 0) {
              // Wenn das heutige Datum angeklickt wird, sollen alle Informationen des Tages wieder
              // angezeigt werden (+ sunrise / sunset)
              // Dann wird die Seite erneut geladen
              HOME.information.update();
            } else {
              // Wenn nicht der heutige Tag angeklickt wurde,
              // werden die Informationen neu dargestellt, die sich
              // im Forecastarray an der gewünschten Stelle befinden
              HOME.information.updateWhenForecast(
                POSITION.forecastEntrys[box.value][FORECAST.hourIndex]
              );
            }
          }
        });
      }
      // Eventhandler für das Einstellen der Uhrzeit im Forecast 
      document
        .getElementsByClassName("hourChangeElement")[0]
        .addEventListener("click", function () {
          // Wenn die erste Seite gedrückt wird, sollen alle Informationen 
          // angezeigt werden
          if (FORECAST.hourIndex >= 1) {
            // Falls es sich um den ersten Eintrag im Array handelt sollen
            // alle Informationen gezeigt werden
            if (FORECAST.index == 0 && FORECAST.hourIndex - 1 == 0) {
              HOME.information.update();
            } else {
              // Wenn nicht, handelt es sich um den Forecast der
              // angezeigt werden soll
              // -3H-Button  zieht vom Index einen ab
              FORECAST.hourIndex -= 1;
              HOME.information.updateWhenForecast(
                POSITION.forecastEntrys[FORECAST.index][FORECAST.hourIndex]
              );
            }
          }
        });
      // wenn der +3H-Button gedrückt wird löst diese Funktion
      // aus
      document
        .getElementsByClassName("hourChangeElement")[1]
        .addEventListener("click", function () {
          if (FORECAST.hourIndex < POSITION.forecastEntrys[FORECAST.index].length - 1) {
            // Erhöht den Stundenindex um 1 und zeigt die Informationen an der Stelle an
            FORECAST.hourIndex += 1;
            HOME.information.updateWhenForecast(POSITION.forecastEntrys[FORECAST.index][FORECAST.hourIndex]);
          }
        });
    },
    // Verändert die Farbe des gedrückten Tages
    // um diesen als ausgewählt zu makieren
    updateBoxColor: function (index) {
      var boxes = document.getElementsByClassName("forecastbox");
      var box = boxes[index];
      box.style.backgroundColor = "#5693C0";
      var old_box = boxes[FORECAST.index];
      FORECAST.index = index;
      old_box.style.backgroundColor = "";
    },
    // Sortieralgorithmus für die Forecast-Informationen
    // die beim response der OPW API zurückkommen
    sortList: function (jsonForecast) {

      var days = [];
      var result = new Array();
      // Rechnet die nächsten fünf Tage aus 
      // und speichert diese im Array days[]
      for (let i = 0; i < 5; i++) {
        result[i] = new Array();
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + i);
        days[i] = tomorrow.getDate();
      }
      // Für jeden JSON-String der zurückkommt im list[] wird 
      // die Zeit ausgerechnet
      for (let i = 0; i < jsonForecast.list.length; i++) {

        // speichert das Datum des Eintrages ab
        var number = convertUnix(jsonForecast.list[i].dt);

        // Im day-Array befinden sich die nächsten 5 Tage, als
        // z.B. 12,13,14 Format. Gleichen sich zwei Daten werden 
        // diese ins result[] an die selbe Stelle gespeichert.

        switch (number) {
          case days[0]:
            result[0].push(jsonForecast.list[i]);
            break;
          case days[1]:
            result[1].push(jsonForecast.list[i]);
            break;
          case days[2]:
            result[2].push(jsonForecast.list[i]);
            break;
          case days[3]:
            result[3].push(jsonForecast.list[i]);
            break;
          case days[4]:
            result[4].push(jsonForecast.list[i]);
            break;
        }
      }
      // Speichert das result[] im POSITION Objekt
      POSITION.forecastEntrys = result;
      function convert(day) {
        return day.getDate();
      }

      function convertUnix(unix) {
        var a = new Date(unix * 1000);
        var date = a.getDate();
        return date;
      }
    }
  };
  let SETTINGS = {
    // Läd die Seite der Einstellungen
    load: function () {
      var parent = document.getElementsByClassName("bodyTemplate")[0];
      keepHeaderDeleteRest();
      var informations = document.createElement("div");
      informations.className = "localInformation";
      var headline = document.createElement("h2");
      headline.textContent = "Einstellungen";
      var usernameWrapper = document.createElement("input");
      var passwordWrapper = document.createElement("input");
      usernameWrapper.id = "usernameSettings";
      passwordWrapper.id = "passwordSettings";
      informations.appendChild(usernameWrapper);
      informations.appendChild(passwordWrapper);
      var saveSettingsButton = document.createElement("button");
      saveSettingsButton.id = "saveSettingsButton";
      saveSettingsButton.textContent = "Speichern";
      parent.appendChild(headline);
      parent.appendChild(informations);
      parent.appendChild(saveSettingsButton);
      SETTINGS.initialize();
    },
    // Bindet die Inputfelder an Variablen um sie dann beim Klick 
    // des Save-Buttons zu übernehmen
    initialize: function () {
      var username = ACCOUNT.username;
      var jsonPack = WEBSTORAGE.getUserInWebstorage(username);
      $("usernameSettings").value = username;
      $("passwordSettings").value = jsonPack.password;
      $("saveSettingsButton").addEventListener("click", SETTINGS.save);
    },
    // Event, das beim Klick ausgelöst wird
    save: function () {
      var button = $("saveSettingsButton");
      var username = $("usernameSettings").value;
      var password = $("passwordSettings").value;
      // Überprüft ob die Daten leer sind und gibt falls sie leer sind, einen Fehler 
      // grafisch aus
      if (username == "" || password == "") {
        displayErrorOnButton(button, "#e8491d", "#35424a");
      } else {
        // Falls nicht werden sie mit der Funktion update im ACCOUNT Objekt an 
        // den Webstorage weitergeben (Validierung erfolgt in update())
        ACCOUNT.update(username, password);
        // Läd die Home-Seite
        HOME.load();
      }
    }
  };
  let ACCOUNT = {
    // Speichert den Nutzernamen, des eingeloggten Users und
    // besitzt Funktionen, um das WEBSTORAGE Objekt anzusprechen
    username: "",

    // speichert einen neuen Nutzer 
    new: function (username, password) {
      var value = {
        password: password,
        favorites: [],
        lastSave: Date.now()
      };
      ACCOUNT.username = username;
      WEBSTORAGE.setUserInWebstorage(username, value);
    },
    // Löscht einen Nutzer anhand des Usernamens
    remove: function (username) {
      WEBSTORAGE.deleteUserInWebstorage(username);
    },
    // Returnt Informationen aus dem LocalStorage über
    // einen User
    getInformations: function (username) {
      return WEBSTORAGE.getUserInWebstorage(username);
    },
    // gibt den Usernamen, des eingeloggten Nutzers wieder
    getActivUsername: function (username) {
      if (username == ACCOUNT.username) {
        return true;
      } else {
        return false;
      }
    },
    // Updatet einen Nutzer
    update: function (username, password) {

      // Refreshed die lastSave Zeit
      WEBSTORAGE.updateLastSaveInWebstorage(ACCOUNT.username);

      // wenn der User gerade eingeloggt ist,
      // wird das Passwort geändert
      if (ACCOUNT.getActivUsername(username)) {
        WEBSTORAGE.changePasswordInWebstorage(username, password);

        // Wenn der Username noch nicht vergeben ist, auch  
        // der Nutzername
      } else if (WEBSTORAGE.checkUserEmpty(username)) {
        var pack = WEBSTORAGE.getUserInWebstorage(ACCOUNT.username);
        var value = {
          password: password,
          favorites: pack.favorites,
          lastSave: Date.now()
        };
        // Setzt den neuen User und löscht die alten Daten
        WEBSTORAGE.setUserInWebstorage(username, value);
        ACCOUNT.remove(ACCOUNT.username);
        ACCOUNT.username = username;
      }
    },
    // Fügt ein Favorite hinzu
    addFavorite: function (location) {
      WEBSTORAGE.setFavoriteInWebstorage(ACCOUNT.username, location);
    },
    // Löscht einen Favoriten
    removeFavorite: function (name) {
      WEBSTORAGE.deleteFavoriteInWebstorage(ACCOUNT.username, name);
    },
    // Holt sich das Array von Favoriten aus dem LocalStorage
    getFavorite: function () {
      var favorites = WEBSTORAGE.getFavoriteInWebstorage(ACCOUNT.username);
      return favorites;
    }
  };

  // Objekt, dass mit der Openweathernet API kommuniziert
  let OPENWEATHERNET = {
    // requested das akutelle Wetter eines Ortes
    request: function (input, currentWeatherUrl) {
      var xhr = new XMLHttpRequest();

      // Reponse Abfangen
      xhr.addEventListener("load", function () {
        var lastRequestedPosition = JSON.parse(xhr.responseText);

        // Wenn als HTTP Status etwas anderes als 200 OK zurück kommt,
        // wird der Response nicht behandelt
        if (lastRequestedPosition.cod == 200) {
          // Wenn es keine Liste in der Antwort gibt, handelt sich es nicht
          // um einen Forecast
          if (lastRequestedPosition.list == null) {
            // Läd die Ortsinformationen in das POSITION Objekt
            POSITION.updatePostition(lastRequestedPosition);

            HOME.information.update();

            // Fügt den Ort als Favorite hinzu
            ACCOUNT.addFavorite(lastRequestedPosition);
          } else {
            // Sortiert die Liste 
            FORECAST.sortList(lastRequestedPosition);
          }
        }
      });

      var openWeathernetURL = "";
      var language = "de";
      var id = "20d31b5e70b5919436402c8b537f19e1"; // KEY

      // Überprüft die Eingabe nach Koordinaten,
      // Postleitzahl und Ortsname
      // Verändert die URL, je nach Eingabeformat
      if (HOME.search.getCoordinates(input)) {
        input = input.split(",");
        var latValue = input[0];
        var lonValue = input[1];
        openWeathernetURL = `${currentWeatherUrl}?lat=${latValue}&lon=${lonValue}&units=metric&appid=${id}&lang=${language}`;
      } else if (HOME.search.getPostcode(input)) {
        var cityID = input;
        openWeathernetURL = `${currentWeatherUrl}?zip=${cityID},${language}&units=metric&appid=${id}&lang=${language}`;
      } else if (HOME.search.getName(input)) {
        openWeathernetURL = `${currentWeatherUrl}?q=${input}&units=metric&appid=${id}&lang=${language}`;
      }
      // Request zur API
      xhr.open("GET", openWeathernetURL);
      xhr.send();
    },
    // Setzt die URL auf "weather" um den heutigen Tag anzufordern
    requestToday: function (location) {
      var currentWeatherUrl = "http://api.openweathermap.org/data/2.5/weather";
      OPENWEATHERNET.request(location, currentWeatherUrl);
    },
    // Setzt die URL auf "forecast" um die nächsten Tage anzufordern
    requestForecast: function (location) {
      var currentWeatherUrl = "http://api.openweathermap.org/data/2.5/forecast";
      OPENWEATHERNET.request(location, currentWeatherUrl);
    }
  };
  // Objekt, dass mit der GEO API kommuniziert
  let GEOLOCATION = {
    //  Request GeoLocation API
    request: function () {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        var value = lat + "," + lon;
        // Sendet die Informationen als Koordinaten zum Objekt OPENWEATHERNET,
        // um dort die Wetterdaten anzufordern
        OPENWEATHERNET.requestToday(value);
      });
    }
  };
  // OBJEKT, das mit dem LOCALSTORAGE des Browser kommuniziert
  let WEBSTORAGE = {
    // gibt alle Einträge zum key username wieder
    getUserInWebstorage: function (username) {
      return JSON.parse(localStorage.getItem(username));
    },
    // Setzt zum Eingabe username das JSON-Packet
    setUserInWebstorage: function (username, pack) {
      localStorage.setItem(username, JSON.stringify(pack));
    },
    // Holt sich die Informationen über den User aus dem Localstorage,
    // fügt ein Favoritennamen, falls dieser noch nicht existiert hinzu und überschreibt 
    // den alten Localstorage Eintrag
    setFavoriteInWebstorage: function (username, locationpack) {
      WEBSTORAGE.updateLastSaveInWebstorage(ACCOUNT.username);
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      var favorites = pack.favorites;
      if (exist(locationpack.name, favorites)) {
        favorites.push(locationpack.name);
        WEBSTORAGE.changeFavoritesInWebstorage(username, favorites);
      }

      function exist(name, favorites) {
        for (let i = 0; i < favorites.length; i++) {
          if (favorites[i] == name) {
            return false;
          }
        }
        return true;
      }
    },
    // Löscht einen Favortiten zum eingeloggten User aus dem Localstorage
    deleteFavoriteInWebstorage: function (username, name) {
      WEBSTORAGE.updateLastSaveInWebstorage(ACCOUNT.username);
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      var favorites = pack.favorites;
      var index;
      for (let i = 0; i < favorites.length; i++) {
        if (favorites[i] == name) {
          index = i;
        }
      }
      favorites.splice(index, 1);
      WEBSTORAGE.changeFavoritesInWebstorage(username, favorites);
    },
    // Holt sich vom eingeloggten User, die Favoriten als Array
    getFavoriteInWebstorage: function (username) {
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      var favorites = pack.favorites;
      return favorites;
    },
    // Überprüft ob der Username bereits besteht
    checkWebstorageEmpty: function (username) {
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      if (pack.favorites.length <= 1) {
        return true;
      } else {
        return false;
      }
    },
    // Updated die Zeit im Localstorage des Users
    updateLastSaveInWebstorage: function (username) {
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      pack.lastSave = Date.now();
      WEBSTORAGE.setUserInWebstorage(username, pack);
    },
    // Holt sich die Zeit aus dem LocalStorage
    getLastSaveWebstorage: function (username) {
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      return pack.lastSave;
    },
    // Ändert das Passwort eines Users
    changePasswordInWebstorage: function (username, value) {
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      pack.password = value;
      WEBSTORAGE.setUserInWebstorage(username, pack);
    },
    // Ändert die Favoriten eines User (BROADCAST)
    changeFavoritesInWebstorage: function (username, favorites) {
      var pack = WEBSTORAGE.getUserInWebstorage(username);
      pack.favorites = favorites;
      WEBSTORAGE.setUserInWebstorage(username, pack);
    },
    // Löscht einen User
    deleteUserInWebstorage: function (username) {
      localStorage.removeItem(username);
    },
    // Überpüft ob ein Nutzer unter dem usernamen bereits
    // existiert
    checkUserEmpty: function (username) {
      if (localStorage.getItem(username) == null) {
        return true;
      } else {
        return false;
      }
    },
    // Überprüft das Passwort eines Users, falls der Nutzername
    // schon existiert
    checkPasswordAccess: function (username, password) {
      var jsonPack = JSON.parse(localStorage.getItem(username));
      if (jsonPack.password == password) {
        return true;
      } else {
        return false;
      }
    },
    // Holt sich das Passwort einen Nutzers
    getPasswordInWebstorage: function (username) {
      var jsonPack = JSON.parse(localStorage.getItem(username));
      return jsonPack.password;
    }
  };
  let CONVERT = {
    // Konvertiert einen Winkel zu einem Windpfeil + Windrichtung 
    deg_to_Direction: function (input) {
      var directions = [
        "S \u{2193}",
        "SW \u{2199}",
        "W \u{2190}",
        "NW \u{2196}",
        "N \u{2191}",
        "NO \u{2197}",
        "O \u{2192}",
        "SO \u{2198}"
      ];
      var eight = 22.5;
      if (input <= eight || input >= 315 + eight) {
        return directions[0];
      } else if (input >= eight && input <= 90 - eight) {
        return directions[1];
      } else if (input >= 45 + eight && input <= 135 - eight) {
        return directions[2];
      } else if (input >= 90 + eight && input <= 180 - eight) {
        return directions[3];
      } else if (input >= 135 + eight && input <= 225 - eight) {
        return directions[4];
      } else if (input >= 180 + eight && input <= 270 - eight) {
        return directions[5];
      } else if (input >= 225 + eight && input <= 315 - eight) {
        return directions[6];
      } else if (input >= 270 + eight && input <= 360 - eight) {
        return directions[7];
      }
    },
    // Konvertiert die Unix Zeit zum normalen Format
    date: function (unix, string) {
      var datum = new Date(unix * 1000);
      var months = ["Jan.", "	Feb.", "Mär.", "Apr.", "Mai.", "Jun.", "Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."];
      var year = datum.getFullYear();
      var hour = datum.getHours();
      var month = months[datum.getMonth()];
      var minute = "0" + datum.getMinutes();
      var second = "0" + datum.getSeconds();
      var day = datum.getDate();

      if (string == "day") {
        return day + "" + month;
      } else if (string == "hour") {
        return hour + ":" + minute.substr(-2);
      } else if (string == "year") {
        return day + " " + month + " " + year;
      }
    }
  };
  // Objekt um die Übersicht anzuzeigen
  let OVERVIEW = {
    temperaturArray: [],
    rainfallArray: [],
    cloudinessArray: [],
    load: function () {
      keepHeaderDeleteRest();
      // Zeigt den Namen des zuletzt gesuchten Ortes als Überschrift an
      var cityName = document.createElement("h2");
      cityName.innerText = POSITION.name + ", " + POSITION.country;
      document.getElementsByClassName("bodyTemplate")[0].appendChild(cityName);
      var overviewWrapper = document.createElement("div");
      overviewWrapper.id = "overviewWrapper";
      // In die Arrays mit den entsprechenden Informationen (Temp,Rain,Bewölkung) werden
      // die Informationen aus dem POSITION Objekt ausgelesen, das den Forecast speichert
      for (let i = 1; i < 5; i++) {
        OVERVIEW.temperaturArray[i] = POSITION.forecastEntrys[i][4].main.temp;
        OVERVIEW.rainfallArray[i] = POSITION.forecastEntrys[i][4].main.humidity;
        OVERVIEW.cloudinessArray[i] = POSITION.forecastEntrys[i][4].clouds.all;
      }
      // Ungerade Zahlen werden aufgerundet, um ganze Zahlen darzustellen
      for (let i = 0; i < OVERVIEW.temperaturArray.length; i++) {
        OVERVIEW.temperaturArray[i] = Math.floor(OVERVIEW.temperaturArray[i]);
      }

      // Zeichnet die drei verschiedenen Diagramme mit anderen Eingabeparametern
      OVERVIEW.draw(overviewWrapper, 250, OVERVIEW.temperaturArray, "temperatur");
      OVERVIEW.draw(overviewWrapper, 250, OVERVIEW.rainfallArray, "rainfall");
      OVERVIEW.draw(overviewWrapper, 250, OVERVIEW.cloudinessArray, "cloudiness");
      document.getElementsByClassName("bodyTemplate")[0].appendChild(overviewWrapper);
    },
    // die Funktion bekommt das Parent-Element, die Höhe des Diagramms, das Array mit 
    // den Informationen und den Typ 

    draw(parent, height, values, type) {

      let length = values.length;
      // Erstellt ein Canvas-Element
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.style.marginTop = 10 + "px";
      canvas.width = length * 60;
      canvas.height = height;

      // Setzt den Hintergrund des Canvas
      ctx.fillStyle = "#d2d2d2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Variablen für verschiedene Parameter zum Anzeigen des Graphens
      let sign = '';
      let multiplicator = 1;
      let text = "";
      let color = "";

      // Beim Typ Temperatur wird die Einheit Grad genommen,bei ...
      // Die Höhe des Temperatur Balkendiagramms wird 4x multipliziert, um die
      // selben Höhen zu besitzen
      switch (type) {
        case "temperatur":
          text = "Temperatur";
          sign = '°';
          multiplicator = 4;
          color = "red";
          break;
        case "rainfall":
          text = "Niederschlag";
          sign = '%';
          color = "#35679a";
          break;
        case "cloudiness":
          text = "Bewölkung";
          sign = '%';
          color = "#2ecc71";
          break;
      }

      var width = 50; // Barbreite
      var X = 5; // Position des ersten Graphens
      var base = 200;

      for (var i = 0; i < values.length; i++) {
        ctx.fillStyle = color;
        var h = values[i] * multiplicator;
        ctx.fillRect(X, canvas.height - h, width, h);

        X += width + 10;
        // Text der Angezeigt wird (Temperatur,Niederschlag,Bewölkung)
        ctx.fillStyle = 'black';
        ctx.font = "20px Arial";
        ctx.fillText(values[i] + sign, X - 50, canvas.height - h - 10);
      }
      // Text der die Einheit an einem Balken anzeigt.
      ctx.fillStyle = "black";
      ctx.font = "25px Arial";
      ctx.fillText(text, canvas.width / 3.5, 75);
      parent.appendChild(canvas);

    }
  };

  let BROADCAST = {
    // das Passwort des Broadcasts ist gleich dem eingeloggten Nutzernamen
    password: ACCOUNT.username,
    ws: "",

    load: function () {
      // Verbindet mit dem Broadcastserver
      BROADCAST.ws = new WebSocket("ws://borsti.inf.fh-flensburg.de:8080");
      BROADCAST.ws.onerror = function () {
        // Zeigt im Header "nicht verbunden" an
        BROADCAST.updateStatus(false);
      };
      BROADCAST.ws.addEventListener("open", function () {
        // Zeigt im Header "verbunden" an
        BROADCAST.updateStatus(true);
        // Sendet auf den Broadcast die Favoriten des Users mit der Statusmeldung
        // Hello.
        BROADCAST.sendMessage(ACCOUNT.getFavorite(), "Hello.");
      });
      BROADCAST.ws.addEventListener("message", (e) => {
        // Wenn der Server mit dem Client kommuniziert,
        // wird die Nachricht ignoriert
        if (e.data.substr(0, 3) === "+++") { } else {
          try {
            // Falls es keine Servernachricht ist,
            // wird die Nachricht versucht zu entschlüsseln
            var pack = BROADCAST.decode(e.data);
            pack = JSON.parse(pack);
            // Danach wird noch der Privatkey ="username" & "password" mit dem 
            // in der Nachricht enthaltenden Daten verglichen
            if (pack.password === WEBSTORAGE.getPasswordInWebstorage(ACCOUNT.username) &&
              pack.username === ACCOUNT.username) {

              // wenn dann sicher ist, das die Nachricht vom gleichen 
              // Benutzer stammt, wird diese ausgelesen
              BROADCAST.evaluateMessage(pack.message, pack.status);
            }
          } catch (error) {
            // Gibt den Error als Alert aus
          }
        }
      });
    },
    // Die Funktion zeigt auf der Home-Seite
    // den Status der Verbindung zum
    // Broadcastserver an
    updateStatus: function (isConnected) {
      var statusDiv = $("status");

      if (isConnected) {
        statusDiv.style.color = "#2ecc71";
        statusDiv.innerText = "Verbunden";
      } else {
        statusDiv.style.color = "red";
        statusDiv.innerText = "Nicht Verbunden";
      }
    },
    // Generiert einen zufälligen PublicKey
    // und shiftet die Zeichen der Nachricht um
    // PublicKey Stellen.
    // Dann wird an die verschlüsselte Nachricht
    // noch der Publickey gehangen, damit dieser in der
    // decode() Methode ausgelesen werden kann
    encode: function (jsonObject) {

      var key = random(Math.pow(2, 31), Math.pow(2, -31)); // PublicKey
      let result = "";
      let objectString = JSON.stringify(jsonObject);
      for (var i = 0; i < objectString.length; i++) {
        var ascii = objectString.charCodeAt(i);
        ascii = ascii + key; // Shift 
        result += String.fromCharCode(ascii);
      }
      result += " " + key; // Hängt PK dran
      return result;

      // Random Key Generator
      function random(max, min) {
        var result = Math.floor(Math.random() * (max - min)) + min;
        if (result === 0) {
          result = random(max, min);
        } else {
          return result;
        }
      }
    },
    // Die Funktion decode() bekommt eine 
    // verschlüsselte Nachricht (String) und löst nun erstmal 
    // den String in zwei Teile auf (Nachricht + PublicKey)
    decode: function (encryptedString) {
      var words = encryptedString.split(' ');
      var key = words[words.length - 1]; // Ließt den PublicKey aus
      let decrypt = "";
      var position = encryptedString.lastIndexOf(key); // Speichert die Länge der Nachricht
      // Jeder Buchstabe wird um key Stellen wieder zurück konvertiert
      for (var i = 0; i < position - 1; i++) {
        let ascii = encryptedString.charCodeAt(i);
        ascii = ascii - parseInt(key);
        decrypt += String.fromCharCode(ascii);
      }
      // Die Nachricht wird dann zurückgegeben
      return decrypt;
    },
    // Bei dem Status = "Hello." wird der geschickte Ortsname
    // zu den Favoriten des Users, der sie empfangen hat, hinzugefügt
    // Dann wird eine Nachricht von dem bereits vorher eingeloggten User versendet mit dem
    // Status "Bye.". In der Nachricht werden dann die Favoriten des Nutzers übermittelt
    // Beide Nutzer sind dann auf dem aktuellen Stand
    evaluateMessage: function (message, status) {
      if (status === "Hello.") {
        for (var i = 0; i < message.length; i++) {
          var messagePack = {
            name: message[i]
          };
          ACCOUNT.addFavorite(messagePack);
        }
        BROADCAST.sendMessage(ACCOUNT.getFavorite(), "Bye.");
      } else if (status === "Bye.") {
        for (var i = 0; i < message.length; i++) {
          var messagePack = {
            name: message[i]
          };
          ACCOUNT.addFavorite(messagePack);
        }
      }
    },
    // Sendet ein Nachrichtenpacket (JSON-Struktur) auf den 
    // Broadcastserver
    sendMessage: function (message, status) {
      var messagePack = {
        "message": message,
        "password": WEBSTORAGE.getPasswordInWebstorage(ACCOUNT.username),
        "username": ACCOUNT.username,
        "status": status
      };
      // Verschlüsselt die Nachricht
      messagePack = BROADCAST.encode(messagePack);
      BROADCAST.ws.send(messagePack);
    }
  };
  // Zeigt einen Error auf dem Eingabe-Button an
  function displayErrorOnButton(button, forcolor, aftercolor) {
    button.style.backgroundColor = forcolor;
    window.setTimeout(function () {
      button.style.backgroundColor = aftercolor;
    }, 200);
  }
  // Customelement
  class FavoriteBox extends HTMLElement {
    // Bekommt bei der Erzeugung den Ortsnamen und
    // das Parentelement
    constructor(name, parent) {
      super();
      // Speichert den Input in Variablen
      this._parent = parent;
      this._name = name;
      this.style.borderRadius = 24 + "px";
    }
    // Beim Appenden an das Parent-Element wird die Funktion
    // connectedCallback() aufgerufen
    connectedCallback() {
      // Gibt dem Custom-Element Stylesheet-Eigenschaften
      this.style.backgroundColor = "white";
      this.style.border = 1 + "px solid #35679a";
      this.style.color = "black";
      this.style.display = "flex";
      this.style.justifyContent = "center";
      this.style.padding = 10 + "px";
      // Fügt als Textknoten den Ortsnamen hinzu
      var cityName = document.createTextNode(this._name);
      this.appendChild(cityName);

      // Such-Button
      var searchButton = document.createElement("button");
      searchButton.className = "favoriteButton";
      searchButton.textContent = "Suchen";

      // Gibt dem Such-Button Variablen, die das Element
      // wissen muss
      searchButton._wrapper = this._parent;
      searchButton._parent = this;
      searchButton._name = this._name;

      // Beim Klick wird die Funktion ausgelöst
      searchButton.addEventListener("click", this.search);
      this.appendChild(searchButton);

      // Delete-Button
      var deleteButton = document.createElement("button");
      deleteButton.className = "favoriteButton";
      deleteButton.textContent = "Entfernen";

      // Gibt dem Such-Button Variablen, die das Element
      // wissen mus
      deleteButton._wrapper = this._parent;
      deleteButton._parent = this;
      deleteButton._name = this._name;

      // Beim Klick wird die Funktion ausgelöst
      deleteButton.addEventListener("click", this.delete);
      this.appendChild(deleteButton);

    }
    disconnectedCallback() { }
    delete() {
      // Löscht das Custom-Element (parent-Element des Buttons)
      // und entfernt den Ortsnamen aus den Favoriten des Nutzers
      // (LocalStorage)
      ACCOUNT.removeFavorite(this._name);
      this._wrapper.removeChild(this._parent);
    }
    search() {
      // Erzeugt die Home-Seite und gibt den Namen des Ortes, der angeklickt wurde
      // in die Suchleiste ein, sodass der Nutzer nurnoch auf Suchen klicken muss
      HOME.load();
      $("searchInput").value = this._name;
    }
  }
  // Schließt den anonymen Namespace
})();