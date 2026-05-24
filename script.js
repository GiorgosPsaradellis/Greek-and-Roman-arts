var departmentsURL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
var searchGreekURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=13&q=greek";
var objectBaseURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

function loadDepartments() {
    fetch(departmentsURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var tbody = document.getElementById("categoriesBody");
            var depts = data.departments;
            
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

function loadGreekArtworks() {
    fetch(searchGreekURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var objectIDs = data.objectIDs.slice(0, 10);
            var tbody = document.getElementById("artworksBody");

            for (var i = 0; i < objectIDs.length; i++) {
                var currentID = objectIDs[i];
                
                fetch(objectBaseURL + currentID)
                    .then(function(res) {
                        return res.json();
                    })
                    .then(function(artItem) {
                        var row = document.createElement("tr");

                        var titleCell = document.createElement("td");
                        titleCell.textContent = artItem.title || "Χωρίς Τίτλο";

                        var creatorCell = document.createElement("td");
                        creatorCell.textContent = artItem.artistDisplayName || artItem.culture || "Άγνωστος";

                        var actionCell = document.createElement("td");
                        var btn = document.createElement("button");
                        btn.textContent = "Προβολή Εικόνας";

                        var imgUrl = artItem.primaryImageSmall || artItem.primaryImage;

                        if (imgUrl) {
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

function showArtworkImage(url) {
    var container = document.getElementById("imagePlaceholder");
    container.innerHTML = ""; 

    var imgTag = document.createElement("img");
    imgTag.setAttribute("src", url);
    imgTag.setAttribute("alt", "Ελληνικό Έργο Τέχνης");
    
    container.appendChild(imgTag);
}

loadDepartments();
loadGreekArtworks();
