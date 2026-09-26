/* =========================================================
   SMART TRANSPORT
   Main JavaScript
========================================================= */


/* =========================================================
   DATA
========================================================= */

const transportData = {

    "Local Train": [
        "CSMT",
        "Masjid",
        "Sandhurst Road",
        "Byculla",
        "Dadar",
        "Kurla",
        "Ghatkopar",
        "Vikhroli",
        "Kanjurmarg",
        "Bhandup",
        "Mulund",
        "Thane",
        "Diva",
        "Dombivli",
        "Kalyan",
        "Churchgate",
        "Marine Lines",
        "Charni Road",
        "Grant Road",
        "Mumbai Central",
        "Mahalaxmi",
        "Lower Parel",
        "Prabhadevi",
        "Bandra",
        "Khar Road",
        "Santacruz",
        "Vile Parle",
        "Andheri",
        "Jogeshwari",
        "Goregaon",
        "Malad",
        "Kandivali",
        "Borivali",
        "Mira Road",
        "Bhayandar",
        "Vasai Road",
        "Panvel",
        "Vashi",
        "Nerul",
        "Belapur"
    ],

    "Metro": [
        "Versova",
        "D.N. Nagar",
        "Andheri",
        "Western Express Highway",
        "Chakala",
        "Airport Road",
        "Marol Naka",
        "Saki Naka",
        "Asalpha",
        "Jagruti Nagar",
        "Ghatkopar",
        "Dahisar East",
        "Kashimira",
        "Mira Road",
        "Bhayandar",
        "CSMT Metro",
        "Churchgate Metro",
        "Bandra Metro",
        "BKC",
        "Kurla Metro",
        "Chembur Metro",
        "Wadala",
        "Ghatkopar Metro"
    ],

    "Bus": [
        "CSMT Bus Stop",
        "Dadar TT",
        "Dadar Plaza",
        "Sion Circle",
        "Kurla Station",
        "Ghatkopar Station",
        "Andheri Station",
        "Bandra Station",
        "BKC",
        "Powai",
        "Mulund Check Naka",
        "Thane Station",
        "Borivali Station",
        "Borivali West",
        "Churchgate",
        "Colaba",
        "Worli",
        "Lower Parel",
        "Parel",
        "Chembur",
        "Vashi",
        "Nerul",
        "Belapur"
    ],

    "Express Train": [
        "Mumbai CSMT",
        "Mumbai Central",
        "Dadar",
        "Thane",
        "Kalyan",
        "Pune",
        "Nashik Road",
        "Surat",
        "Vadodara",
        "Ahmedabad",
        "Bhopal",
        "Indore",
        "Nagpur",
        "Delhi",
        "Jaipur",
        "Agra",
        "Varanasi",
        "Prayagraj",
        "Lucknow",
        "Kolkata",
        "Bengaluru",
        "Chennai",
        "Hyderabad",
        "Goa"
    ],

    "Flight": [
        "Mumbai (BOM)",
        "Delhi (DEL)",
        "Bengaluru (BLR)",
        "Chennai (MAA)",
        "Hyderabad (HYD)",
        "Kolkata (CCU)",
        "Pune (PNQ)",
        "Ahmedabad (AMD)",
        "Goa (GOI)",
        "Jaipur (JAI)",
        "Kochi (COK)",
        "Lucknow (LKO)",
        "Varanasi (VNS)",
        "Indore (IDR)",
        "Nagpur (NAG)",
        "Bhopal (BHO)",
        "Chandigarh (IXC)",
        "Bhubaneswar (BBI)",
        "Patna (PAT)",
        "Guwahati (GAU)"
    ]

};


/* =========================================================
   DEMO FARE CONFIGURATION
========================================================= */

const fareData = {

    "Local Train": {
        base: 15,
        perPassenger: 15
    },

    "Metro": {
        base: 20,
        perPassenger: 20
    },

    "Bus": {
        base: 15,
        perPassenger: 15
    },

    "Express Train": {
        base: 350,
        perPassenger: 350
    },

    "Flight": {
        base: 2500,
        perPassenger: 2500
    }

};


/* =========================================================
   APPLICATION STATE
========================================================= */

let selectedTransport = "Local Train";

let selectedPaymentMethod = "wallet";

let selectedJourney = null;

let currentBookingFilter = "all";

let locationWatchId = null;

let liveLocationMap = null;

let liveLocationMarker = null;

let liveLocationAccuracy = null;

let latestLocation = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setMinimumDate();

    updateLocations();

    updateDashboard();

    displayBookings();

    updateWallet();

    updateNavigation();

});


/* =========================================================
   DATE
========================================================= */

function setMinimumDate() {

    const dateInput = document.getElementById("travelDate");

    if (!dateInput) return;

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;

    dateInput.min = date;

    if (!dateInput.value) {
        dateInput.value = date;
    }

}


/* =========================================================
   TRANSPORT SELECTION
========================================================= */

function selectTransport(type) {

    selectedTransport = type;

    document.querySelectorAll(".transport-option").forEach(button => {

        button.classList.remove("active");

        if (button.dataset.type === type) {
            button.classList.add("active");
        }

    });

    updateLocations();

    document.getElementById("book").scrollIntoView({
        behavior: "smooth"
    });

    showToast(`${type} selected`);

}


/* =========================================================
   UPDATE LOCATION LISTS
========================================================= */

function updateLocations() {

    const sourceList = document.getElementById("sourceList");

    const destinationList =
        document.getElementById("destinationList");

    if (!sourceList || !destinationList) return;

    sourceList.innerHTML = "";

    destinationList.innerHTML = "";

    const locations = transportData[selectedTransport] || [];

    locations.forEach(location => {

        const sourceOption = document.createElement("option");

        sourceOption.value = location;

        sourceList.appendChild(sourceOption);


        const destinationOption =
            document.createElement("option");

        destinationOption.value = location;

        destinationList.appendChild(destinationOption);

    });

}


/* =========================================================
   SWAP LOCATIONS
========================================================= */

function swapLocations() {

    const source = document.getElementById("source");

    const destination =
        document.getElementById("destination");

    const temporary = source.value;

    source.value = destination.value;

    destination.value = temporary;

}


/* =========================================================
   SEARCH TRANSPORT
========================================================= */

function searchTransport() {

    const source =
        document.getElementById("source").value.trim();

    const destination =
        document.getElementById("destination").value.trim();

    const travelDate =
        document.getElementById("travelDate").value;

    const passengers =
        Number(document.getElementById("passengers").value);

    const travelClass =
        document.getElementById("travelClass").value;


    if (!source || !destination) {

        showToast("Please enter source and destination.");

        return;
    }


    if (source.toLowerCase() === destination.toLowerCase()) {

        showToast("Source and destination cannot be the same.");

        return;
    }


    if (!travelDate) {

        showToast("Please select travel date.");

        return;
    }


    selectedJourney = {

        transport: selectedTransport,

        source,

        destination,

        date: travelDate,

        passengers,

        travelClass

    };


    displaySearchResults();

}


/* =========================================================
   SEARCH RESULTS
========================================================= */

function displaySearchResults() {

    const section =
        document.getElementById("resultsSection");

    const container =
        document.getElementById("resultsContainer");

    section.classList.remove("hidden");

    const transport = selectedJourney.transport;

    const source = selectedJourney.source;

    const destination = selectedJourney.destination;

    const passengers = selectedJourney.passengers;

    const travelClass = selectedJourney.travelClass;


    const baseFare =
        calculateFare(
            transport,
            passengers,
            travelClass
        );


    const services = generateServices(transport);


    container.innerHTML = services.map(service => {

        const fare =
            Math.round(baseFare * service.multiplier);

        return `

        <div class="result-card">

            <div class="result-icon">
                ${service.icon}
            </div>

            <div class="result-details">

                <h3>${service.name}</h3>

                <div class="result-route">
                    ${source}
                    <span> → </span>
                    ${destination}
                </div>

                <div class="result-meta">
                    ${service.departure}
                    -
                    ${service.arrival}
                    •
                    ${service.duration}
                    •
                    ${travelClass}
                </div>

                <div class="result-meta">
                    ${service.info}
                </div>

            </div>

            <div class="result-price">

                <p>Starting from</p>

                <h2>₹${fare}</h2>

                <button
                    class="book-result-btn"
                    onclick="selectJourney(${fare}, '${service.name}', '${service.departure}', '${service.arrival}')">

                    Select

                </button>

            </div>

        </div>

        `;

    }).join("");

    section.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================================
   GENERATE SERVICES
========================================================= */

function generateServices(type) {

    if (type === "Local Train") {

        return [

            {
                icon: "🚆",
                name: "Mumbai Local",
                departure: "08:15 AM",
                arrival: "09:05 AM",
                duration: "50 min",
                info: "Fast local service",
                multiplier: 1
            },

            {
                icon: "🚆",
                name: "Mumbai Local Fast",
                departure: "09:00 AM",
                arrival: "09:40 AM",
                duration: "40 min",
                info: "Fast service",
                multiplier: 1.3
            },

            {
                icon: "🚆",
                name: "Mumbai Local",
                departure: "10:30 AM",
                arrival: "11:20 AM",
                duration: "50 min",
                info: "Regular service",
                multiplier: 1
            }

        ];

    }


    if (type === "Metro") {

        return [

            {
                icon: "🚇",
                name: "Mumbai Metro",
                departure: "08:30 AM",
                arrival: "09:05 AM",
                duration: "35 min",
                info: "Metro service",
                multiplier: 1
            },

            {
                icon: "🚇",
                name: "Mumbai Metro Express",
                departure: "09:15 AM",
                arrival: "09:45 AM",
                duration: "30 min",
                info: "Limited stop service",
                multiplier: 1.2
            }

        ];

    }


    if (type === "Bus") {

        return [

            {
                icon: "🚌",
                name: "City Bus",
                departure: "08:20 AM",
                arrival: "09:20 AM",
                duration: "60 min",
                info: "Regular bus",
                multiplier: 1
            },

            {
                icon: "🚌",
                name: "Express Bus",
                departure: "09:00 AM",
                arrival: "09:45 AM",
                duration: "45 min",
                info: "Limited stops",
                multiplier: 1.4
            }

        ];

    }


    if (type === "Express Train") {

        return [

            {
                icon: "🚄",
                name: "Intercity Express",
                departure: "06:30 AM",
                arrival: "10:30 AM",
                duration: "4 hr",
                info: "Chair/Sleeper availability",
                multiplier: 1
            },

            {
                icon: "🚄",
                name: "Superfast Express",
                departure: "08:00 AM",
                arrival: "11:30 AM",
                duration: "3.5 hr",
                info: "Superfast service",
                multiplier: 1.5
            },

            {
                icon: "🚄",
                name: "Premium Express",
                departure: "10:00 AM",
                arrival: "01:30 PM",
                duration: "3.5 hr",
                info: "Premium service",
                multiplier: 2
            }

        ];

    }


    if (type === "Flight") {

        return [

            {
                icon: "✈️",
                name: "Air India",
                departure: "07:00 AM",
                arrival: "09:00 AM",
                duration: "2 hr",
                info: "Non-stop",
                multiplier: 1
            },

            {
                icon: "✈️",
                name: "IndiGo",
                departure: "09:30 AM",
                arrival: "11:30 AM",
                duration: "2 hr",
                info: "Non-stop",
                multiplier: 0.9
            },

            {
                icon: "✈️",
                name: "Akasa Air",
                departure: "12:00 PM",
                arrival: "02:05 PM",
                duration: "2 hr 5 min",
                info: "Non-stop",
                multiplier: 0.95
            }

        ];

    }


    return [];

}


/* =========================================================
   FARE CALCULATION
========================================================= */

function calculateFare(
    transport,
    passengers,
    travelClass
) {

    const data = fareData[transport];

    if (!data) return 0;

    let fare =
        data.base +
        data.perPassenger * passengers;


    if (transport === "Express Train") {

        if (travelClass === "Sleeper") {
            fare *= 1.3;
        }

        if (travelClass === "AC") {
            fare *= 2.1;
        }

        if (travelClass === "Business") {
            fare *= 3;
        }

    }


    if (transport === "Flight") {

        if (travelClass === "Business") {
            fare *= 2.5;
        }

        if (travelClass === "AC") {
            fare *= 1.5;
        }

    }


    return Math.round(fare);

}


/* =========================================================
   SELECT JOURNEY
========================================================= */

function selectJourney(
    fare,
    serviceName,
    departure,
    arrival
) {

    selectedJourney.fare = fare;

    selectedJourney.service = serviceName;

    selectedJourney.departure = departure;

    selectedJourney.arrival = arrival;


    if (!isLoggedIn()) {

        showToast("Please login before booking.");

        openLogin();

        return;

    }


    openPaymentModal();

}


/* =========================================================
   PAYMENT MODAL
========================================================= */

function openPaymentModal() {

    if (!selectedJourney) return;


    const summary =
        document.getElementById("paymentSummary");


    summary.innerHTML = `

        <div class="payment-summary">

            <div class="payment-summary-row">
                <span>Transport</span>
                <strong>${selectedJourney.transport}</strong>
            </div>

            <div class="payment-summary-row">
                <span>Service</span>
                <strong>${selectedJourney.service}</strong>
            </div>

            <div class="payment-summary-row">
                <span>Journey</span>
                <strong>
                    ${selectedJourney.source}
                    →
                    ${selectedJourney.destination}
                </strong>
            </div>

            <div class="payment-summary-row">
                <span>Date</span>
                <strong>${formatDate(selectedJourney.date)}</strong>
            </div>

            <div class="payment-summary-row">
                <span>Passengers</span>
                <strong>${selectedJourney.passengers}</strong>
            </div>

            <div class="payment-summary-row">
                <span>Taxes & Fees</span>
                <strong>₹0</strong>
            </div>

            <div class="payment-summary-row payment-summary-total">
                <span>Total Amount</span>
                <strong>₹${selectedJourney.fare}</strong>
            </div>

        </div>

    `;


    document.getElementById("paymentWalletBalance").innerText =
        `₹${getWalletBalance().toLocaleString("en-IN")}`;


    document.getElementById("paymentModal")
        .classList.add("show");

}


/* =========================================================
   PAYMENT METHOD
========================================================= */

function selectPayment(method, button) {

    selectedPaymentMethod = method;


    document.querySelectorAll(".payment-tab")
        .forEach(tab => tab.classList.remove("active"));

    button.classList.add("active");


    document.getElementById("walletPayment")
        .classList.add("hidden");

    document.getElementById("cardPayment")
        .classList.add("hidden");

    document.getElementById("upiPayment")
        .classList.add("hidden");


    if (method === "wallet") {

        document.getElementById("walletPayment")
            .classList.remove("hidden");

    }


    if (method === "card") {

        document.getElementById("cardPayment")
            .classList.remove("hidden");

    }


    if (method === "upi") {

        document.getElementById("upiPayment")
            .classList.remove("hidden");

    }

}


/* =========================================================
   PROCESS PAYMENT
========================================================= */

function processPayment() {

    if (!selectedJourney) {

        showToast("No journey selected.");

        return;

    }


    const amount = selectedJourney.fare;


    if (selectedPaymentMethod === "wallet") {

        const balance = getWalletBalance();

        if (balance < amount) {

            showToast("Insufficient wallet balance.");

            return;

        }

        updateWalletBalance(balance - amount);

        addWalletTransaction(
            "Booking Payment",
            -amount
        );

    }


    if (selectedPaymentMethod === "card") {

        const cardName =
            document.getElementById("cardName").value.trim();

        const cardNumber =
            document.getElementById("cardNumber").value.trim();

        const expiry =
            document.getElementById("cardExpiry").value.trim();

        const cvv =
            document.getElementById("cardCVV").value.trim();


        if (!cardName || !cardNumber || !expiry || !cvv) {

            showToast("Please complete card details.");

            return;

        }


        if (cardNumber.replace(/\s/g, "").length < 12) {

            showToast("Please enter a valid card number.");

            return;

        }

    }


    if (selectedPaymentMethod === "upi") {

        const upi =
            document.getElementById("upiId").value.trim();


        if (!upi || !upi.includes("@")) {

            showToast("Enter a valid UPI ID.");

            return;

        }

    }


    createBooking();

}


/* =========================================================
   CREATE BOOKING
========================================================= */

function createBooking() {

    const bookings = getBookings();


    const bookingId =
        "ST" +
        Date.now().toString().slice(-8);


    const transactionId =
        "TXN" +
        Date.now().toString().slice(-9);


    const booking = {

        id: bookingId,

        transactionId,

        user: getCurrentUser()?.email || "guest",

        transport: selectedJourney.transport,

        service: selectedJourney.service,

        source: selectedJourney.source,

        destination: selectedJourney.destination,

        date: selectedJourney.date,

        departure: selectedJourney.departure,

        arrival: selectedJourney.arrival,

        passengers: selectedJourney.passengers,

        travelClass: selectedJourney.travelClass,

        fare: selectedJourney.fare,

        paymentMethod:
            getPaymentMethodName(),

        status: "Upcoming",

        createdAt: new Date().toISOString()

    };


    bookings.push(booking);

    localStorage.setItem(
        "smartBookings",
        JSON.stringify(bookings)
    );


    closeModal("paymentModal");


    showReceipt(booking);


    updateDashboard();

    displayBookings();

}


/* =========================================================
   PAYMENT METHOD NAME
========================================================= */

function getPaymentMethodName() {

    if (selectedPaymentMethod === "wallet") {
        return "My Wallet";
    }

    if (selectedPaymentMethod === "card") {
        return "Debit Card";
    }

    if (selectedPaymentMethod === "upi") {
        return "UPI";
    }

    return "Unknown";

}


/* =========================================================
   RECEIPT
========================================================= */

function showReceipt(booking) {

    const receipt =
        document.getElementById("receiptContent");


    receipt.innerHTML = `

        <div class="receipt">

            <div class="receipt-header">

                <h2>SMART TRANSPORT</h2>

                <p>Digital Travel Ticket</p>

                <p>✓ Payment Successful</p>

            </div>


            <div class="receipt-row">
                <span>Booking ID</span>
                <strong>${booking.id}</strong>
            </div>

            <div class="receipt-row">
                <span>Transaction ID</span>
                <strong>${booking.transactionId}</strong>
            </div>

            <div class="receipt-row">
                <span>Transport</span>
                <strong>${booking.transport}</strong>
            </div>

            <div class="receipt-row">
                <span>Service</span>
                <strong>${booking.service}</strong>
            </div>

            <div class="receipt-row">
                <span>From</span>
                <strong>${booking.source}</strong>
            </div>

            <div class="receipt-row">
                <span>To</span>
                <strong>${booking.destination}</strong>
            </div>

            <div class="receipt-row">
                <span>Date</span>
                <strong>${formatDate(booking.date)}</strong>
            </div>

            <div class="receipt-row">
                <span>Departure</span>
                <strong>${booking.departure}</strong>
            </div>

            <div class="receipt-row">
                <span>Arrival</span>
                <strong>${booking.arrival}</strong>
            </div>

            <div class="receipt-row">
                <span>Passengers</span>
                <strong>${booking.passengers}</strong>
            </div>

            <div class="receipt-row">
                <span>Class</span>
                <strong>${booking.travelClass}</strong>
            </div>

            <div class="receipt-row">
                <span>Payment</span>
                <strong>${booking.paymentMethod}</strong>
            </div>

            <div class="receipt-row receipt-total">
                <span>Total Paid</span>
                <strong>₹${booking.fare}</strong>
            </div>

        </div>

    `;


    const qr =
        document.getElementById("qrcode");

    qr.innerHTML = "";


    if (typeof QRCode !== "undefined") {

        new QRCode(qr, {

            text:
                `SMART TRANSPORT | ${booking.id} | ${booking.source} to ${booking.destination}`,

            width: 120,

            height: 120

        });

    }


    document.getElementById("receiptModal")
        .classList.add("show");


    showToast("Booking successful!");
}


/* =========================================================
   PRINT RECEIPT
========================================================= */

function printReceipt() {

    window.print();

}


/* =========================================================
   BOOKINGS
========================================================= */

function getBookings() {

    return JSON.parse(
        localStorage.getItem("smartBookings") || "[]"
    );

}


/* =========================================================
   DISPLAY BOOKINGS
========================================================= */

function displayBookings() {

    const container =
        document.getElementById("bookingList");

    if (!container) return;


    const user = getCurrentUser();

    let bookings = getBookings();


    if (user) {

        bookings =
            bookings.filter(
                booking => booking.user === user.email
            );

    }


    if (currentBookingFilter !== "all") {

        bookings =
            bookings.filter(
                booking =>
                    booking.status === currentBookingFilter
            );

    }


    bookings.sort(
        (a,b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
    );


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty-bookings">

                <h2>🎫</h2>

                <h3>No Bookings Found</h3>

                <p>
                    Your successful bookings will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        bookings.map(booking => bookingHTML(booking)).join("");

}


/* =========================================================
   BOOKING HTML
========================================================= */

function bookingHTML(booking) {

    return `

        <div class="booking-item">

            <div class="booking-top">

                <div>

                    <strong>
                        ${getTransportIcon(booking.transport)}
                        ${booking.transport}
                    </strong>

                    <div class="booking-id">
                        Booking ID: ${booking.id}
                    </div>

                </div>

                <span class="booking-status">
                    ${booking.status}
                </span>

            </div>


            <div class="booking-route">

                <div>
                    <small>FROM</small>
                    <strong>${booking.source}</strong>
                </div>

                <span>→</span>

                <div>
                    <small>TO</small>
                    <strong>${booking.destination}</strong>
                </div>

            </div>


            <div class="booking-bottom">

                <div>

                    <strong>
                        ${formatDate(booking.date)}
                    </strong>

                    <p>
                        ${booking.departure}
                        -
                        ${booking.arrival}
                        •
                        ${booking.passengers} Passenger(s)
                    </p>

                    <strong>
                        ₹${booking.fare}
                    </strong>

                </div>


                <div class="booking-actions">

                    <button
                        onclick="viewBooking('${booking.id}')">
                        🎫 Ticket
                    </button>

                    ${
                        booking.status === "Upcoming"
                        ?
                        `<button
                            class="cancel-booking"
                            onclick="cancelBooking('${booking.id}')">
                            Cancel
                        </button>`
                        :
                        ""
                    }

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   VIEW BOOKING
========================================================= */

function viewBooking(id) {

    const booking =
        getBookings().find(
            item => item.id === id
        );


    if (!booking) {

        showToast("Booking not found.");

        return;

    }


    showReceipt(booking);

}


/* =========================================================
   CANCEL BOOKING
========================================================= */

function cancelBooking(id) {

    const bookings = getBookings();


    const index =
        bookings.findIndex(
            booking => booking.id === id
        );


    if (index === -1) return;


    const booking = bookings[index];


    const confirmed =
        confirm(
            `Cancel booking ${booking.id}?`
        );


    if (!confirmed) return;


    bookings[index].status = "Cancelled";


    localStorage.setItem(
        "smartBookings",
        JSON.stringify(bookings)
    );


    showToast("Booking cancelled.");

    displayBookings();

    updateDashboard();

}


/* =========================================================
   FILTER BOOKINGS
========================================================= */

function filterBookings(filter, button) {

    currentBookingFilter = filter;


    document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));


    button.classList.add("active");


    displayBookings();

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const bookings = getBookings();

    const user = getCurrentUser();


    let userBookings = bookings;


    if (user) {

        userBookings =
            bookings.filter(
                booking => booking.user === user.email
            );

    }


    const total =
        userBookings.length;


    const spent =
        userBookings
            .filter(
                booking => booking.status !== "Cancelled"
            )
            .reduce(
                (sum, booking) => sum + booking.fare,
                0
            );


    const upcoming =
        userBookings.filter(
            booking =>
                booking.status === "Upcoming"
        ).length;


    document.getElementById("totalBookings")
        .innerText = total;


    document.getElementById("totalSpent")
        .innerText =
        `₹${spent.toLocaleString("en-IN")}`;


    document.getElementById("upcomingTrips")
        .innerText = upcoming;


    document.getElementById("dashboardName")
        .innerText =
        user ? user.name : "Guest User";


    document.getElementById("accountStatus")
        .innerText =
        user ? "Active" : "Guest";

}


/* =========================================================
   LOGIN
========================================================= */

function login(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById("loginPassword")
            .value;


    const users =
        JSON.parse(
            localStorage.getItem("smartUsers") || "[]"
        );


    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        showToast("Invalid email or password.");

        return;

    }


    localStorage.setItem(
        "smartCurrentUser",
        JSON.stringify(user)
    );


    closeModal("loginModal");


    document.getElementById("loginEmail").value = "";

    document.getElementById("loginPassword").value = "";


    updateNavigation();

    updateDashboard();

    displayBookings();


    showToast(`Welcome ${user.name}!`);

}


/* =========================================================
   REGISTER
========================================================= */

function register(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName")
            .value
            .trim();


    const email =
        document.getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();


    const phone =
        document.getElementById("registerPhone")
            .value
            .trim();


    const password =
        document.getElementById("registerPassword")
            .value;


    const confirm =
        document.getElementById("registerConfirm")
            .value;


    if (password !== confirm) {

        showToast("Passwords do not match.");

        return;

    }


    if (password.length < 6) {

        showToast(
            "Password must contain at least 6 characters."
        );

        return;

    }


    let users =
        JSON.parse(
            localStorage.getItem("smartUsers") || "[]"
        );


    const exists =
        users.some(
            user => user.email === email
        );


    if (exists) {

        showToast("Account already exists.");

        return;

    }


    const user = {

        name,

        email,

        phone,

        password

    };


    users.push(user);


    localStorage.setItem(
        "smartUsers",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "smartCurrentUser",
        JSON.stringify(user)
    );


    closeModal("registerModal");


    updateNavigation();

    updateDashboard();


    showToast(
        "Account created successfully!"
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(
        "smartCurrentUser"
    );


    updateNavigation();

    updateDashboard();

    displayBookings();


    showToast("You have been logged out.");

}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("smartCurrentUser") || "null"
    );

}


function isLoggedIn() {

    return getCurrentUser() !== null;

}


/* =========================================================
   NAVIGATION
========================================================= */

function updateNavigation() {

    const user = getCurrentUser();


    const loginButton =
        document.querySelector(".login-btn");

    const registerButton =
        document.querySelector(".register-btn");


    if (user) {

        loginButton.innerText = "👤 " + user.name;

        loginButton.onclick = () => {

            document.getElementById("dashboard")
                .scrollIntoView({
                    behavior: "smooth"
                });

        };

        registerButton.innerText = "Logout";

        registerButton.onclick = logout;

    }

    else {

        loginButton.innerText = "Login";

        loginButton.onclick = openLogin;

        registerButton.innerText = "Register";

        registerButton.onclick = openRegister;

    }

}


/* =========================================================
   LOGIN / REGISTER MODALS
========================================================= */

function openLogin() {

    document.getElementById("loginModal")
        .classList.add("show");

}


function openRegister() {

    document.getElementById("registerModal")
        .classList.add("show");

}


function switchToRegister() {

    closeModal("loginModal");

    openRegister();

}


function switchToLogin() {

    closeModal("registerModal");

    openLogin();

}


function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");

}


/* =========================================================
   WALLET
========================================================= */

function getWalletBalance() {

    const user = getCurrentUser();

    if (!user) return 0;


    const wallets =
        JSON.parse(
            localStorage.getItem("smartWallets") || "{}"
        );


    if (
        wallets[user.email] === undefined
    ) {

        wallets[user.email] = 2000;

        localStorage.setItem(
            "smartWallets",
            JSON.stringify(wallets)
        );

    }


    return wallets[user.email];

}


function updateWalletBalance(amount) {

    const user = getCurrentUser();

    if (!user) return;


    const wallets =
        JSON.parse(
            localStorage.getItem("smartWallets") || "{}"
        );


    wallets[user.email] = amount;


    localStorage.setItem(
        "smartWallets",
        JSON.stringify(wallets)
    );


    updateWallet();

}


function updateWallet() {

    const balance = getWalletBalance();


    const walletElement =
        document.getElementById("walletBalance");


    if (walletElement) {

        walletElement.innerText =
            `₹${balance.toLocaleString("en-IN")}`;

    }


    const paymentBalance =
        document.getElementById(
            "paymentWalletBalance"
        );


    if (paymentBalance) {

        paymentBalance.innerText =
            `₹${balance.toLocaleString("en-IN")}`;

    }


    displayWalletTransactions();

}


/* =========================================================
   WALLET MODAL
========================================================= */

function openWalletModal() {

    if (!isLoggedIn()) {

        showToast("Please login first.");

        openLogin();

        return;

    }


    document.getElementById("walletModal")
        .classList.add("show");

}


function setWalletAmount(amount) {

    document.getElementById(
        "addMoneyAmount"
    ).value = amount;

}


/* =========================================================
   ADD MONEY
========================================================= */

function addMoney() {

    const amount =
        Number(
            document.getElementById(
                "addMoneyAmount"
            ).value
        );


    if (!amount || amount <= 0) {

        showToast("Enter a valid amount.");

        return;

    }


    const current =
        getWalletBalance();


    updateWalletBalance(
        current + amount
    );


    addWalletTransaction(
        "Wallet Top-up",
        amount
    );


    closeModal("walletModal");


    document.getElementById(
        "addMoneyAmount"
    ).value = "";


    showToast(
        `₹${amount} added to wallet.`
    );

}


/* =========================================================
   WALLET TRANSACTIONS
========================================================= */

function getWalletTransactions() {

    const user = getCurrentUser();

    if (!user) return [];


    const all =
        JSON.parse(
            localStorage.getItem(
                "smartWalletTransactions"
            ) || "{}"
        );


    return all[user.email] || [];

}


function addWalletTransaction(
    description,
    amount
) {

    const user = getCurrentUser();

    if (!user) return;


    const all =
        JSON.parse(
            localStorage.getItem(
                "smartWalletTransactions"
            ) || "{}"
        );


    if (!all[user.email]) {

        all[user.email] = [];

    }


    all[user.email].unshift({

        description,

        amount,

        date: new Date().toISOString(),

        balance: getWalletBalance()

    });


    localStorage.setItem(
        "smartWalletTransactions",
        JSON.stringify(all)
    );


    displayWalletTransactions();

}


function displayWalletTransactions() {

    const container =
        document.getElementById(
            "walletTransactions"
        );


    if (!container) return;


    const transactions =
        getWalletTransactions();


    if (transactions.length === 0) {

        container.innerHTML =
            `<p class="empty-text">
                No transactions yet.
            </p>`;

        return;

    }


    container.innerHTML =
        transactions
            .slice(0, 10)
            .map(transaction => {

                const positive =
                    transaction.amount > 0;


                return `

                <div class="transaction">

                    <div>

                        <strong>
                            ${transaction.description}
                        </strong>

                        <small>
                            ${formatDateTime(
                                transaction.date
                            )}
                        </small>

                    </div>

                    <strong style="color:
                        ${positive
                            ? "#16853c"
                            : "#e53935"
                        }">

                        ${positive ? "+" : ""}
                        ₹${Math.abs(
                            transaction.amount
                        )}

                    </strong>

                </div>

                `;

            })
            .join("");

}


/* =========================================================
   LOCATION
========================================================= */

function getLocation() {

    const status =
        document.getElementById(
            "locationStatus"
        );


    if (!navigator.geolocation) {

        status.innerText =
            "Location is not supported by your browser.";

        return;

    }

    if (locationWatchId !== null) {

        return;

    }

    status.innerText =
        "Starting live location tracking...";


    locationWatchId =
        navigator.geolocation.watchPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;

            latestLocation = {
                latitude,
                longitude,
                accuracy,
                timestamp: position.timestamp
            };

            status.innerText =
                `Live location active · accuracy ±${Math.round(accuracy)} m · updated ${new Date(position.timestamp).toLocaleTimeString()}`;


            showLocationSuggestions(
                latitude,
                longitude,
                accuracy
            );

        },

        error => {

            stopLocationTracking();

            const messages = {
                1: "Location permission was denied. Enable it in your browser settings to track your position.",
                2: "Your position is unavailable right now. Check your device location settings and try again.",
                3: "Location request timed out. Try starting tracking again."
            };

            status.innerText =
                messages[error.code] || "Unable to get your location. Please try again.";

            showToast(
                status.innerText
            );

        },

        {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 15000
        }

    );

}


function stopLocationTracking() {

    if (locationWatchId !== null) {

        navigator.geolocation.clearWatch(locationWatchId);

        locationWatchId = null;

    }

    document.getElementById("locationStartButton").disabled = false;

    document.getElementById("locationStopButton")
        .classList.add("hidden");

    if (latestLocation) {

        document.getElementById("locationStatus").innerText =
            "Location tracking stopped. The last position remains on the map.";

    }

}


/* =========================================================
   LOCATION SUGGESTIONS
========================================================= */

function showLocationSuggestions(
    latitude,
    longitude,
    accuracy
) {

    const result =
        document.getElementById(
            "locationResult"
        );


    document.getElementById("locationStartButton").disabled = true;

    document.getElementById("locationStopButton")
        .classList.remove("hidden");

    if (!liveLocationMap) {

        result.innerHTML = `
            <div class="location-map-panel">
                <div id="liveLocationMap" role="region" aria-label="Map showing your live location"></div>
                <p class="location-map-note">
                    Live Mumbai bus and train positions are not connected yet; they require a real-time feed from a transit provider.
                </p>
            </div>
        `;

        if (typeof L === "undefined") {

            result.innerHTML =
                "The map could not load. Check your internet connection and try again.";

            return;

        }

        liveLocationMap = L.map("liveLocationMap")
            .setView([latitude, longitude], 16);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap contributors"
            }
        ).addTo(liveLocationMap);

        liveLocationMarker = L.circleMarker(
            [latitude, longitude],
            {
                radius: 9,
                color: "#ffffff",
                weight: 3,
                fillColor: "#146ef5",
                fillOpacity: 1
            }
        ).addTo(liveLocationMap);

        liveLocationAccuracy = L.circle(
            [latitude, longitude],
            {
                radius: Math.max(accuracy, 1),
                color: "#146ef5",
                weight: 1,
                fillColor: "#146ef5",
                fillOpacity: 0.12
            }
        ).addTo(liveLocationMap);

        requestAnimationFrame(() => {

            liveLocationMap.invalidateSize();

        });

        return;

    }

    const coordinates = [latitude, longitude];

    liveLocationMarker.setLatLng(coordinates);

    liveLocationAccuracy
        .setLatLng(coordinates)
        .setRadius(Math.max(accuracy, 1));

    liveLocationMap.panTo(coordinates);

}


/* =========================================================
   COUPONS
========================================================= */

function copyCoupon(code) {

    if (navigator.clipboard) {

        navigator.clipboard.writeText(code);

    }

    showToast(
        `${code} copied!`
    );

}


/* =========================================================
   CONTACT FORM
========================================================= */

function submitContact(event) {

    event.preventDefault();


    showToast(
        "Your message has been submitted."
    );


    event.target.reset();

}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatDateTime(dateString) {

    return new Date(dateString)
        .toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


function getTransportIcon(type) {

    const icons = {

        "Local Train": "🚆",

        "Metro": "🚇",

        "Bus": "🚌",

        "Express Train": "🚄",

        "Flight": "✈️"

    };


    return icons[type] || "🎫";

}


/* =========================================================
   SCROLL FUNCTIONS
========================================================= */

function scrollToBooking() {

    document.getElementById("book")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToBookings() {

    document.getElementById("bookings")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.innerText = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {

    const nav =
        document.getElementById("mainNav");


    if (nav.style.display === "flex") {

        nav.style.display = "";

    }

    else {

        nav.style.display = "flex";

        nav.style.position = "absolute";

        nav.style.top = "72px";

        nav.style.left = "0";

        nav.style.right = "0";

        nav.style.padding = "20px";

        nav.style.background = "white";

        nav.style.flexDirection = "column";

    }

}


/* =========================================================
   CLOSE MODALS BY CLICKING OUTSIDE
========================================================= */

document.querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove("show");

                }

            }
        );

    });