// Endpoints από το API του The Met
var departmentsURL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
var searchGreekURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=13&q=greek";
var objectBaseURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

// 1. Ανάκτηση και εμφάνιση βασικής κατηγορίας (Τμήματα Μουσείου)
function loadDepartments() {
    fetch(departmentsURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var tbody = document.getElementById("categoriesBody");
            var depts = data.departments;
            
            // Κλασική δομή επανάληψης με for σύμφωνα με τις διαλέξεις
            for (var i = 0; i < depts.length; i++) {
                var row = document.createElement("tr");
                var cell = document.createElement("td");
                cell.textContent = depts[i].displayName;
                row.appendChild(cell);
                tbody.appendChild(row);
            }
        })
        .catch(function(error) {
            console.error("Σφάλμα κατά την ανάκτηση τμημάτων:", error);
        });
}

// 2. Ανάκτηση 10 Ελληνικών Έργων Τέχνης
function loadGreekArtworks() {
    fetch(searchGreekURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Παίρνουμε τα πρώτα 10 IDs από τα αποτελέσματα με slice
            var objectIDs = data.objectIDs.slice(0, 10);
            var tbody = document.getElementById("artworksBody");

            // Κλασικό for για τα 10 αντικείμενα
            for (var i = 0; i < objectIDs.length; i++) {
                var currentID = objectIDs[i];
                
                fetch(objectBaseURL + currentID)
                    .then(function(res) {
                        return res.json();
                    })
                    .then(function(artItem) {
                        var row = document.createElement("tr");

                        // Όνομα/Τίτλος αντικειμένου
                        var titleCell = document.createElement("td");
                        titleCell.textContent = artItem.title || "Χωρίς Τίτλο";

                        // Δημιουργός ή Πολιτισμός/Προέλευση
                        var creatorCell = document.createElement("td");
                        creatorCell.textContent = artItem.artistDisplayName || artItem.culture || "Άγνωστος";

                        // Κουμπί για την εικόνα
                        var actionCell = document.createElement("td");
                        var btn = document.createElement("button");
                        btn.textContent = "Προβολή Εικόνας";
                        
                        // Έλεγχος για τη διεύθυνση της εικόνας στο JSON object
                        var imgUrl = artItem.primaryImageSmall || artItem.primaryImage;

                        if (imgUrl) {
                            // Χειριστής συμβάντος (Event Listener) με παραδοσιακή function
                            btn.addEventListener("click", function() {
                                showArtworkImage(imgUrl);
                            });
                        } else {
                            btn.textContent = "Μη διαθέσιμη";
                            btn.disabled = true;
                        }

                        actionCell.appendChild(btn);
                        row.appendChild(titleCell);
                        row.appendChild(creatorCell);
                        row.appendChild(actionCell);
                        tbody.appendChild(row);
                    });
            }
        })
        .catch(function(error) {
            console.error("Σφάλμα κατά την ανάκτηση έργων:", error);
        });
}

// 3. Συνάρτηση εμφάνισης εικόνας (Επιτόπου δημιουργία του img tag στο DOM)
function showArtworkImage(url) {
    var container = document.getElementById("imagePlaceholder");
    // Καθαρισμός προηγούμενου περιεχομένου
    container.innerHTML = ""; 
    
    // Δημιουργία και απόδοση attributes (src, alt) όπως στη Διάλεξη #5 (DOM)
    var imgTag = document.createElement("img");
    imgTag.setAttribute("src", url);
    imgTag.setAttribute("alt", "Ελληνικό Έργο Τέχνης");
    
    container.appendChild(imgTag);
}

// Εκτέλεση των συναρτήσεων κατά τη φόρτωση
loadDepartments();
loadGreekArtworks();