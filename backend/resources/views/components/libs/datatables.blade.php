@prepend('styles')
    <link href="{{ asset('/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('/libs/datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('/libs/datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('/libs/datatables.net-select-bs4/css/select.bootstrap4.min.css') }}" rel="stylesheet" type="text/css" />
@endprepend

@prepend('scripts')
    <!-- third party js -->
    <script src="{{ asset('libs/datatables.net/js/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-responsive/js/dataTables.responsive.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-responsive-bs4/js/responsive.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-buttons/js/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-buttons/js/buttons.html5.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-buttons/js/buttons.flash.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-buttons/js/buttons.print.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-keytable/js/dataTables.keyTable.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net-select/js/dataTables.select.min.js') }}"></script>
    <script src="{{ asset('libs/datatables.net/js/dataTables.colReorder.min.js') }}"></script>
    <script src="{{ asset('libs/pdfmake/build/pdfmake.min.js') }}"></script>
    <script src="{{ asset('libs/pdfmake/build/vfs_fonts.js') }}"></script>

    <script type="text/javascript">
        let buttons = [
            'copyHtml5',
            {
                extend: 'csvHtml5',
                charset: 'UTF-8',
                fieldSeparator: ';',
                bom: true,
            },
            'pdfHtml5',
        ];

        @switch(\Illuminate\Support\Facades\App::getLocale())
            @case('en')
                $.extend(true, $.fn.dataTable.defaults, {
                    language: {
                        "emptyTable": "No data available in table",
                        "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                        "infoEmpty": "Showing 0 to 0 of 0 entries",
                        "infoFiltered": "(filtered from _MAX_ total entries)",
                        "infoThousands": ",",
                        "lengthMenu": "Show _MENU_ entries",
                        "loadingRecords": "Loading...",
                        "processing": "Processing...",
                        "search": "Search:",
                        "zeroRecords": "No matching records found",
                        "thousands": ",",
                        "paginate": {
                            "first": "First",
                            "last": "Last",
                            "next": "Next",
                            "previous": "Previous"
                        },
                        "aria": {
                            "sortAscending": ": activate to sort column ascending",
                            "sortDescending": ": activate to sort column descending"
                        },
                        "autoFill": {
                            "cancel": "Cancel",
                            "fill": "Fill all cells with <i>%d<\/i>",
                            "fillHorizontal": "Fill cells horizontally",
                            "fillVertical": "Fill cells vertically"
                        },
                        "buttons": {
                            "collection": "Collection <span class='ui-button-icon-primary ui-icon ui-icon-triangle-1-s'\/>",
                            "colvis": "Column Visibility",
                            "colvisRestore": "Restore visibility",
                            "copy": "Copy",
                            "copyKeys": "Press ctrl or u2318 + C to copy the table data to your system clipboard.<br><br>To cancel, click this message or press escape.",
                            "copySuccess": {
                                "1": "Copied 1 row to clipboard",
                                "_": "Copied %d rows to clipboard"
                            },
                            "copyTitle": "Copy to Clipboard",
                            "csv": "CSV",
                            "excel": "Excel",
                            "pageLength": {
                                "-1": "Show all rows",
                                "_": "Show %d rows"
                            },
                            "pdf": "PDF",
                            "print": "Print"
                        },
                        "searchBuilder": {
                            "add": "Add Condition",
                            "button": {
                                "0": "Search Builder",
                                "_": "Search Builder (%d)"
                            },
                            "clearAll": "Clear All",
                            "condition": "Condition",
                            "conditions": {
                                "date": {
                                    "after": "After",
                                    "before": "Before",
                                    "between": "Between",
                                    "empty": "Empty",
                                    "equals": "Equals",
                                    "not": "Not",
                                    "notBetween": "Not Between",
                                    "notEmpty": "Not Empty"
                                },
                                "number": {
                                    "between": "Between",
                                    "empty": "Empty",
                                    "equals": "Equals",
                                    "gt": "Greater Than",
                                    "gte": "Greater Than Equal To",
                                    "lt": "Less Than",
                                    "lte": "Less Than Equal To",
                                    "not": "Not",
                                    "notBetween": "Not Between",
                                    "notEmpty": "Not Empty"
                                },
                                "string": {
                                    "contains": "Contains",
                                    "empty": "Empty",
                                    "endsWith": "Ends With",
                                    "equals": "Equals",
                                    "not": "Not",
                                    "notEmpty": "Not Empty",
                                    "startsWith": "Starts With"
                                },
                                "array": {
                                    "without": "Without",
                                    "notEmpty": "Not Empty",
                                    "not": "Not",
                                    "contains": "Contains",
                                    "empty": "Empty",
                                    "equals": "Equals"
                                }
                            },
                            "data": "Data",
                            "deleteTitle": "Delete filtering rule",
                            "leftTitle": "Outdent Criteria",
                            "logicAnd": "And",
                            "logicOr": "Or",
                            "rightTitle": "Indent Criteria",
                            "title": {
                                "0": "Search Builder",
                                "_": "Search Builder (%d)"
                            },
                            "value": "Value"
                        },
                        "searchPanes": {
                            "clearMessage": "Clear All",
                            "collapse": {
                                "0": "SearchPanes",
                                "_": "SearchPanes (%d)"
                            },
                            "count": "{total}",
                            "countFiltered": "{shown} ({total})",
                            "emptyPanes": "No SearchPanes",
                            "loadMessage": "Loading SearchPanes",
                            "title": "Filters Active - %d"
                        },
                        "select": {
                            "1": "%d row selected",
                            "_": "%d rows selected",
                            "cells": {
                                "1": "1 cell selected",
                                "_": "%d cells selected"
                            },
                            "columns": {
                                "1": "1 column selected",
                                "_": "%d columns selected"
                            }
                        },
                        "datetime": {
                            "previous": "Previous",
                            "next": "Next",
                            "hours": "Hour",
                            "minutes": "Minute",
                            "seconds": "Second",
                            "unknown": "-",
                            "amPm": [
                                "am",
                                "pm"
                            ],
                            "weekdays": [
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat"
                            ],
                            "months": [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                            ]
                        },
                        "editor": {
                            "close": "Close",
                            "create": {
                                "button": "New",
                                "title": "Create new entry",
                                "submit": "Create"
                            },
                            "edit": {
                                "button": "Edit",
                                "title": "Edit Entry",
                                "submit": "Update"
                            },
                            "remove": {
                                "button": "Delete",
                                "title": "Delete",
                                "submit": "Delete",
                                "confirm": {
                                    "_": "Are you sure you wish to delete %d rows?",
                                    "1": "Are you sure you wish to delete 1 row?"
                                }
                            },
                            "error": {
                                "system": "A system error has occurred (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">More information<\/a>)."
                            },
                            "multi": {
                                "title": "Multiple Values",
                                "info": "The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.",
                                "restore": "Undo Changes",
                                "noMulti": "This input can be edited individually, but not part of a group. "
                            }
                        }
                    },
                    dom: 'Bfrtip',
                    buttons: buttons,
                });
                @break
                @case('fr')
                    $.extend(true, $.fn.dataTable.defaults, {
                        language: {
                            "emptyTable": "Aucune donnée disponible dans le tableau",
                            "lengthMenu": "Afficher _MENU_ éléments",
                            "loadingRecords": "Chargement...",
                            "processing": "Traitement...",
                            "zeroRecords": "Aucun élément correspondant trouvé",
                            "paginate": {
                                "first": "Premier",
                                "last": "Dernier",
                                "previous": "Précédent",
                                "next": "Suiv"
                            },
                            "aria": {
                                "sortAscending": ": activer pour trier la colonne par ordre croissant",
                                "sortDescending": ": activer pour trier la colonne par ordre décroissant"
                            },
                            "select": {
                                "rows": {
                                    "_": "%d lignes sélectionnées",
                                    "1": "1 ligne sélectionnée"
                                },
                                "cells": {
                                    "1": "1 cellule sélectionnée",
                                    "_": "%d cellules sélectionnées"
                                },
                                "columns": {
                                    "1": "1 colonne sélectionnée",
                                    "_": "%d colonnes sélectionnées"
                                }
                            },
                            "autoFill": {
                                "cancel": "Annuler",
                                "fill": "Remplir toutes les cellules avec <i>%d<\/i>",
                                "fillHorizontal": "Remplir les cellules horizontalement",
                                "fillVertical": "Remplir les cellules verticalement"
                            },
                            "searchBuilder": {
                                "conditions": {
                                    "date": {
                                        "after": "Après le",
                                        "before": "Avant le",
                                        "between": "Entre",
                                        "empty": "Vide",
                                        "equals": "Egal à",
                                        "not": "Différent de",
                                        "notBetween": "Pas entre",
                                        "notEmpty": "Non vide"
                                    },
                                    "number": {
                                        "between": "Entre",
                                        "empty": "Vide",
                                        "equals": "Egal à",
                                        "gt": "Supérieur à",
                                        "gte": "Supérieur ou égal à",
                                        "lt": "Inférieur à",
                                        "lte": "Inférieur ou égal à",
                                        "not": "Différent de",
                                        "notBetween": "Pas entre",
                                        "notEmpty": "Non vide"
                                    },
                                    "string": {
                                        "contains": "Contient",
                                        "empty": "Vide",
                                        "endsWith": "Se termine par",
                                        "equals": "Egal à",
                                        "not": "Différent de",
                                        "notEmpty": "Non vide",
                                        "startsWith": "Commence par"
                                    },
                                    "array": {
                                        "equals": "Egal à",
                                        "empty": "Vide",
                                        "contains": "Contient",
                                        "not": "Différent de",
                                        "notEmpty": "Non vide",
                                        "without": "Sans"
                                    }
                                },
                                "add": "Ajouter une condition",
                                "button": {
                                    "0": "Recherche avancée",
                                    "_": "Recherche avancée (%d)"
                                },
                                "clearAll": "Effacer tout",
                                "condition": "Condition",
                                "data": "Donnée",
                                "deleteTitle": "Supprimer la règle de filtrage",
                                "logicAnd": "Et",
                                "logicOr": "Ou",
                                "title": {
                                    "0": "Recherche avancée",
                                    "_": "Recherche avancée (%d)"
                                },
                                "value": "Valeur"
                            },
                            "searchPanes": {
                                "clearMessage": "Effacer tout",
                                "count": "{total}",
                                "title": "Filtres actifs - %d",
                                "collapse": {
                                    "0": "Volet de recherche",
                                    "_": "Volet de recherche (%d)"
                                },
                                "countFiltered": "{shown} ({total})",
                                "emptyPanes": "Pas de volet de recherche",
                                "loadMessage": "Chargement du volet de recherche..."
                            },
                            "buttons": {
                                "copyKeys": "Appuyer sur ctrl ou u2318 + C pour copier les données du tableau dans votre presse-papier.",
                                "collection": "Collection",
                                "colvis": "Visibilité colonnes",
                                "colvisRestore": "Rétablir visibilité",
                                "copy": "Copier",
                                "copySuccess": {
                                    "1": "1 ligne copiée dans le presse-papier",
                                    "_": "%ds lignes copiées dans le presse-papier"
                                },
                                "copyTitle": "Copier dans le presse-papier",
                                "csv": "CSV",
                                "excel": "Excel",
                                "pageLength": {
                                    "-1": "Afficher toutes les lignes",
                                    "_": "Afficher %d lignes"
                                },
                                "pdf": "PDF",
                                "print": "Imprimer"
                            },
                            "decimal": ",",
                            "info": "Affichage de _START_ à _END_ sur _TOTAL_ éléments",
                            "infoEmpty": "Affichage de 0 à 0 sur 0 éléments",
                            "infoThousands": ".",
                            "search": "Rechercher:",
                            "thousands": ".",
                            "infoFiltered": "(filtrés depuis un total de _MAX_ éléments)",
                            "datetime": {
                                "previous": "Précédent",
                                "next": "Suivant",
                                "hours": "Heures",
                                "minutes": "Minutes",
                                "seconds": "Secondes",
                                "unknown": "-",
                                "amPm": [
                                    "am",
                                    "pm"
                                ]
                            },
                            "editor": {
                                "close": "Fermer",
                                "create": {
                                    "button": "Nouveaux",
                                    "title": "Créer une nouvelle entrée",
                                    "submit": "Envoyer"
                                },
                                "edit": {
                                    "button": "Editer",
                                    "title": "Editer Entrée",
                                    "submit": "Modifier"
                                },
                                "remove": {
                                    "button": "Supprimer",
                                    "title": "Supprimer",
                                    "submit": "Supprimer"
                                },
                                "error": {
                                    "system": "Une erreur système s'est produite"
                                },
                                "multi": {
                                    "title": "Valeurs Multiples",
                                    "restore": "Rétablir Modification"
                                }
                            }
                        },
                        dom: 'Bfrtip',
                        buttons: buttons,
                    });
            @break
            @case('es')
                $.extend(true, $.fn.dataTable.defaults, {
                    language: {
                        "processing": "Procesando...",
                        "lengthMenu": "Mostrar _MENU_ registros",
                        "zeroRecords": "No se encontraron resultados",
                        "emptyTable": "Ningún dato disponible en esta tabla",
                        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                        "search": "Buscar:",
                        "infoThousands": ",",
                        "loadingRecords": "Cargando...",
                        "paginate": {
                            "first": "Primero",
                            "last": "Último",
                            "next": "Siguiente",
                            "previous": "Anterior"
                        },
                        "aria": {
                            "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                            "sortDescending": ": Activar para ordenar la columna de manera descendente"
                        },
                        "buttons": {
                            "copy": "Copiar",
                            "colvis": "Visibilidad",
                            "collection": "Colección",
                            "colvisRestore": "Restaurar visibilidad",
                            "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
                            "copySuccess": {
                                "1": "Copiada 1 fila al portapapeles",
                                "_": "Copiadas %d fila al portapapeles"
                            },
                            "copyTitle": "Copiar al portapapeles",
                            "csv": "CSV",
                            "excel": "Excel",
                            "pageLength": {
                                "-1": "Mostrar todas las filas",
                                "1": "Mostrar 1 fila",
                                "_": "Mostrar %d filas"
                            },
                            "pdf": "PDF",
                            "print": "Imprimir"
                        },
                        "autoFill": {
                            "cancel": "Cancelar",
                            "fill": "Rellene todas las celdas con <i>%d<\/i>",
                            "fillHorizontal": "Rellenar celdas horizontalmente",
                            "fillVertical": "Rellenar celdas verticalmentemente"
                        },
                        "decimal": ",",
                        "searchBuilder": {
                            "add": "Añadir condición",
                            "button": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "clearAll": "Borrar todo",
                            "condition": "Condición",
                            "conditions": {
                                "date": {
                                    "after": "Despues",
                                    "before": "Antes",
                                    "between": "Entre",
                                    "empty": "Vacío",
                                    "equals": "Igual a",
                                    "notBetween": "No entre",
                                    "notEmpty": "No Vacio",
                                    "not": "Diferente de"
                                },
                                "number": {
                                    "between": "Entre",
                                    "empty": "Vacio",
                                    "equals": "Igual a",
                                    "gt": "Mayor a",
                                    "gte": "Mayor o igual a",
                                    "lt": "Menor que",
                                    "lte": "Menor o igual que",
                                    "notBetween": "No entre",
                                    "notEmpty": "No vacío",
                                    "not": "Diferente de"
                                },
                                "string": {
                                    "contains": "Contiene",
                                    "empty": "Vacío",
                                    "endsWith": "Termina en",
                                    "equals": "Igual a",
                                    "notEmpty": "No Vacio",
                                    "startsWith": "Empieza con",
                                    "not": "Diferente de"
                                },
                                "array": {
                                    "not": "Diferente de",
                                    "equals": "Igual",
                                    "empty": "Vacío",
                                    "contains": "Contiene",
                                    "notEmpty": "No Vacío",
                                    "without": "Sin"
                                }
                            },
                            "data": "Data",
                            "deleteTitle": "Eliminar regla de filtrado",
                            "leftTitle": "Criterios anulados",
                            "logicAnd": "Y",
                            "logicOr": "O",
                            "rightTitle": "Criterios de sangría",
                            "title": {
                                "0": "Constructor de búsqueda",
                                "_": "Constructor de búsqueda (%d)"
                            },
                            "value": "Valor"
                        },
                        "searchPanes": {
                            "clearMessage": "Borrar todo",
                            "collapse": {
                                "0": "Paneles de búsqueda",
                                "_": "Paneles de búsqueda (%d)"
                            },
                            "count": "{total}",
                            "countFiltered": "{shown} ({total})",
                            "emptyPanes": "Sin paneles de búsqueda",
                            "loadMessage": "Cargando paneles de búsqueda",
                            "title": "Filtros Activos - %d"
                        },
                        "select": {
                            "1": "%d fila seleccionada",
                            "_": "%d filas seleccionadas",
                            "cells": {
                                "1": "1 celda seleccionada",
                                "_": "$d celdas seleccionadas"
                            },
                            "columns": {
                                "1": "1 columna seleccionada",
                                "_": "%d columnas seleccionadas"
                            }
                        },
                        "thousands": ".",
                        "datetime": {
                            "previous": "Anterior",
                            "next": "Proximo",
                            "hours": "Horas",
                            "minutes": "Minutos",
                            "seconds": "Segundos",
                            "unknown": "-",
                            "amPm": [
                                "am",
                                "pm"
                            ]
                        },
                        "editor": {
                            "close": "Cerrar",
                            "create": {
                                "button": "Nuevo",
                                "title": "Crear Nuevo Registro",
                                "submit": "Crear"
                            },
                            "edit": {
                                "button": "Editar",
                                "title": "Editar Registro",
                                "submit": "Actualizar"
                            },
                            "remove": {
                                "button": "Eliminar",
                                "title": "Eliminar Registro",
                                "submit": "Eliminar",
                                "confirm": {
                                    "_": "¿Está seguro que desea eliminar %d filas?",
                                    "1": "¿Está seguro que desea eliminar 1 fila?"
                                }
                            },
                            "error": {
                                "system": "Ha ocurrido un error en el sistema (<a target=\"\\\" rel=\"\\ nofollow\" href=\"\\\">Más información&lt;\\\/a&gt;).<\/a>"
                            },
                            "multi": {
                                "title": "Múltiples Valores",
                                "info": "Los elementos seleccionados contienen diferentes valores para este registro. Para editar y establecer todos los elementos de este registro con el mismo valor, hacer click o tap aquí, de lo contrario conservarán sus valores individuales.",
                                "restore": "Deshacer Cambios",
                                "noMulti": "Este registro puede ser editado individualmente, pero no como parte de un grupo."
                            }
                        },
                        "info": "Mostrando de _START_ a _END_ de _TOTAL_ entradas"
                    },
                    dom: 'Bfrtip',
                    buttons: buttons,
                });
                @break
            @case('pt_BR')
                $.extend(true, $.fn.dataTable.defaults, {
                    language: {
                        sEmptyTable: "Nenhum registro encontrado",
                        sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
                        sInfoFiltered: "(Filtrados de _MAX_ registros)",
                        sInfoThousands: ".",
                        sLengthMenu: "_MENU_ resultados por página",
                        sLoadingRecords: "Carregando...",
                        sProcessing: "Processando...",
                        sZeroRecords: "Nenhum registro encontrado",
                        sSearch: "Pesquisar",
                        oPaginate: {
                            sNext: "Próximo",
                            sPrevious: "Anterior",
                            sFirst: "Primeiro",
                            sLast: "Último"
                        },
                        oAria: {
                            sSortAscending: ": Ordenar colunas de forma ascendente",
                            sSortDescending: ": Ordenar colunas de forma descendente"
                        },
                        select: {
                            rows: {
                                "_": "Selecionado %d linhas",
                                "0": "Nenhuma linha selecionada",
                                "1": "Selecionado 1 linha"
                            }
                        },
                        buttons: {
                            copy: "Copiar",
                            copyTitle: "Copiado para a área de transferência",
                            copySuccess: {
                                "1": "Uma linha copiada com sucesso",
                                "_": "%d linhas copiadas com sucesso"
                            }
                        },
                        decimal: ',',
                        thousands: '.'
                    },
                    dom: 'Bfrtip',
                    buttons: buttons,
                });
                @break
            @case('pt')
                $.extend(true, $.fn.dataTable.defaults, {
                    language: {
                        "emptyTable": "Não foi encontrado nenhum registo",
                        "loadingRecords": "A carregar...",
                        "processing": "A processar...",
                        "lengthMenu": "Mostrar _MENU_ registos",
                        "zeroRecords": "Não foram encontrados resultados",
                        "search": "Procurar:",
                        "paginate": {
                            "first": "Primeiro",
                            "previous": "Anterior",
                            "next": "Seguinte",
                            "last": "Último"
                        },
                        "aria": {
                            "sortAscending": ": Ordenar colunas de forma ascendente",
                            "sortDescending": ": Ordenar colunas de forma descendente"
                        },
                        "autoFill": {
                            "cancel": "cancelar",
                            "fill": "preencher",
                            "fillHorizontal": "preencher células na horizontal",
                            "fillVertical": "preencher células na vertical",
                            "info": "Exemplo de Auto Preenchimento"
                        },
                        "buttons": {
                            "collection": "Coleção",
                            "colvis": "Visibilidade de colunas",
                            "colvisRestore": "Restaurar visibilidade",
                            "copy": "Copiar",
                            "copyKeys": "Pressiona CTRL ou u2318 + C para copiar a informação para a área de transferência. Para cancelar, clica neste mensagem ou pressiona ESC.",
                            "copySuccess": {
                                "1": "Uma linha copiada para a área de transferência",
                                "_": "%ds linhas copiadas para a área de transferência"
                            },
                            "copyTitle": "Copiar para a área de transferência",
                            "csv": "CSV",
                            "excel": "Excel",
                            "pageLength": {
                                "-1": "Mostrar todas as linhas",
                                "1": "Mostrar 1 linha",
                                "_": "Mostrar %d linhas"
                            },
                            "pdf": "PDF",
                            "print": "Imprimir"
                        },
                        "decimal": ",",
                        "infoFiltered": "(filtrado num total de _MAX_ registos)",
                        "infoThousands": ".",
                        "searchBuilder": {
                            "add": "Adicionar condição",
                            "button": {
                                "0": "Construtor de pesquisa",
                                "_": "Construtor de pesquisa (%d)"
                            },
                            "clearAll": "Limpar tudo",
                            "condition": "Condição",
                            "conditions": {
                                "date": {
                                    "after": "Depois",
                                    "before": "Antes",
                                    "between": "Entre",
                                    "empty": "Vazio",
                                    "equals": "Igual",
                                    "not": "Diferente",
                                    "notBetween": "Não está entre",
                                    "notEmpty": "Não está vazio"
                                },
                                "number": {
                                    "between": "Entre",
                                    "empty": "Vazio",
                                    "equals": "Igual",
                                    "gt": "Maior que",
                                    "gte": "Maior ou igual a",
                                    "lt": "Menor que",
                                    "lte": "Menor ou igual a",
                                    "not": "Diferente",
                                    "notBetween": "Não está entre",
                                    "notEmpty": "Não está vazio"
                                },
                                "string": {
                                    "contains": "Contém",
                                    "empty": "Vazio",
                                    "endsWith": "Termina em",
                                    "equals": "Igual",
                                    "not": "Diferente",
                                    "notEmpty": "Não está vazio",
                                    "startsWith": "Começa em"
                                },
                                "array": {
                                    "equals": "Igual",
                                    "empty": "Vazio",
                                    "contains": "Contém",
                                    "not": "Diferente",
                                    "notEmpty": "Não está vazio",
                                    "without": "Não contém"
                                }
                            },
                            "data": "Dados",
                            "deleteTitle": "Excluir condição de filtragem",
                            "logicAnd": "E",
                            "logicOr": "Ou",
                            "title": {
                                "0": "Construtor de pesquisa",
                                "_": "Construtor de pesquisa (%d)"
                            },
                            "value": "Valor"
                        },
                        "searchPanes": {
                            "clearMessage": "Limpar tudo",
                            "collapse": {
                                "0": "Painéis de pesquisa",
                                "_": "Painéis de pesquisa (%d)"
                            },
                            "count": "{total}",
                            "countFiltered": "{shown} ({total})",
                            "emptyPanes": "Sem painéis de pesquisa",
                            "loadMessage": "A carregar painéis de pesquisa",
                            "title": "Filtros ativos"
                        },
                        "select": {
                            "1": "%d linha seleccionada",
                            "_": "%d linhas seleccionadas",
                            "cells": {
                                "1": "1 célula seleccionada",
                                "_": "%d células seleccionadas"
                            },
                            "columns": {
                                "1": "1 coluna seleccionada",
                                "_": "%d colunas seleccionadas"
                            },
                            "rows": {
                                "1": "%d linha seleccionada"
                            }
                        },
                        "thousands": ".",
                        "editor": {
                            "close": "Fechar",
                            "create": {
                                "button": "Novo",
                                "title": "Criar novo registro",
                                "submit": "Criar"
                            },
                            "edit": {
                                "button": "Editar",
                                "title": "Editar registro",
                                "submit": "Atualizar"
                            },
                            "remove": {
                                "button": "Remover",
                                "title": "Remover",
                                "submit": "Remover"
                            },
                            "error": {
                                "system": "Um erro no sistema ocorreu"
                            },
                            "multi": {
                                "title": "Multiplos valores",
                                "info": "Os itens selecionados contêm valores diferentes para esta entrada. Para editar e definir todos os itens para esta entrada com o mesmo valor, clique ou toque aqui, caso contrário, eles manterão seus valores individuais.",
                                "restore": "Desfazer alterações"
                            }
                        },
                        "info": "Mostrando os registos _START_ a _END_ num total de _TOTAL_",
                        "infoEmpty": "Mostrando 0 os registos num total de 0"
                    },
                    dom: 'Bfrtip',
                    buttons: buttons,
                });
            @break
        @endswitch
    </script>
@endprepend
