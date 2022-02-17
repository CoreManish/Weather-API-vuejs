const app = new Vue({
    el: "#vue-app",
    data: {
        name: "manish",
        currentCity: "",
        cities: [] // array containing info of different city as an object
    },

    methods: {
        addCity: async function () {
            //check if currentCity already exist or not
            let flag = "notexist";
            for (let i in this.cities) {
                if (this.cities[i].cityname.toLowerCase() === this.currentCity.toLowerCase()) {
                    flag = "exist"
                }
            }
            if (flag === "exist") {
                return alert("This city already present")
            }

            //start fetching data
            root_url = "https://api.openweathermap.org/data/2.5/weather"
            apikey = "e61469653abb0703f20ef330594a9879"
            full_url = root_url + "?q=" + this.currentCity + "&appid=" + apikey
            fetchPromiseResolved = await fetch(full_url)
            //console.log(fetchPromiseResolved.status)


            //check if city available on openweather or not
            if (fetchPromiseResolved.status != 200) {
                return alert("This is invalid city")
            }

            //get data in javascript object format
            dataObject = await fetchPromiseResolved.json()
            console.log(dataObject)

            //make date
            const d = new Date();
            //Now make object from required data
            myDataObject = {
                cityname: dataObject.name,
                country: dataObject.sys.country,
                temp: (dataObject.main.temp - 273).toFixed(2),
                feels_like: (dataObject.main.feels_like - 273).toFixed(2),
                temp_min: (dataObject.main.temp_min - 273).toFixed(2),
                temp_max: (dataObject.main.temp_max - 273).toFixed(2),
                humidity: dataObject.main.humidity,
                pressure: (dataObject.main.pressure * 100 / 101325).toFixed(3),
                date: d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
            }

            //Now add myDataObject to vue data (cities) and localStorage
            this.cities.push(myDataObject)
            localStorage.cities = JSON.stringify(this.cities)


        }
    },
    components: {
        eachdata: {
            props: ['c'],
            template: `
            <div class="card" style="width: 20rem;">
                <div class="card-body">
                    <h5 class="card-title">City Name: {{c.cityname}}</h5>
                    <p>Country: {{c.country}}</p>
                    <p>Current Temp: {{c.temp}}&#8451</p>
                    <p>Feels like: {{c.feels_like}}&#8451</p>
                    <p>Minimum Temp: {{c.temp_min}}&#8451</p>
                    <p>Maximum Temp: {{c.temp_max}}&#8451</p>
                    <p>Humidity: {{c.humidity}}&#37</p>
                    <p>Pressure: {{c.pressure}} atm</p>
                    <button class="btn btn-success" v-on:click="update">Update</button>
                    <button class="btn btn-danger" v-on:click="remove">Remove</button><br><br>
                    <div class="card-footer">
                        <small class="text-muted">Last updated: {{c.date}}</small>
                    </div>
                </div>
                
            </div>`,
            methods: {
                remove: function () {
                    //alert(this.c.cityname)
                    for (let i = 0; i < app.cities.length; i++) {
                        if (app.cities[i].cityname === this.c.cityname) {
                            app.cities.splice(i, 1)
                        }
                    }
                    localStorage.cities = JSON.stringify(app.cities)
                },
                update: async function () {
                    //start fetching data
                    root_url = "https://api.openweathermap.org/data/2.5/weather"
                    apikey = "e61469653abb0703f20ef330594a9879"
                    full_url = root_url + "?q=" + this.c.cityname + "&appid=" + apikey
                    fetchPromiseResolved = await fetch(full_url)
                    //get data in javascript object format
                    dataObject = await fetchPromiseResolved.json()

                    //make date
                    const d = new Date();

                    for (let i in app.cities) {
                        if (app.cities[i].cityname == this.c.cityname) {

                            app.cities[i].temp = (dataObject.main.temp - 273).toFixed(2)
                            app.cities[i].feels_like = (dataObject.main.feels_like - 273).toFixed(2)
                            app.cities[i].temp_min = (dataObject.main.temp_min - 273).toFixed(2)
                            app.cities[i].temp_max = (dataObject.main.temp_max - 273).toFixed(2)
                            app.cities[i].humidity = dataObject.main.humidity
                            app.cities[i].pressure = (dataObject.main.pressure * 100 / 101325).toFixed(3)
                            app.cities[i].date = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
                        }
                    }
                    localStorage.cities = JSON.stringify(app.cities)
                }

            }
        }
    },
    mounted() {
        if (localStorage.cities) {
            //after loading and mounting, take value from localStorage and put in vue data
            this.cities = JSON.parse(localStorage.cities)
        }
    }
});
