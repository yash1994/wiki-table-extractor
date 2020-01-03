"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = function ExtractTablesP(url, dupcols, duprows) {
    if (dupcols === undefined) dupcols=false;
    if (duprows === undefined) duprows=false;
    return new Promise(function (resolve, reject){
        request(url, function (error, response, body){
            if(error) reject(error)
            var $ = cheerio.load(body)
            var tables = []
            $(".wikitable").each(function (table_idx, table){
                var tarray = [],
                    row_x = 0,
                    col_y = 0;
                $("tr", table).each(function (row_idx, row){
                    col_y = 0
                    $("td, th", row).each(function (col_idx, col){
                        var rowspan = $(col).attr('rowspan') || 1;
                        var colspan = $(col).attr('colspan') || 1;
                        var content = $(col).text().trim() || "";

                        for(let x=0; x < rowspan; x++){
                            for(let y=0; y < colspan; y++){
                                if (tarray[col_y + y] === undefined){
                                    tarray[col_y + y] = []
                                }
                                while (tarray[col_y + y][row_x + x] !== undefined){
                                    col_y += 1
                                    if (tarray[col_y + y] === undefined){
                                        tarray[col_y + y] = []
                                    }
                                }
                                if ((x === 0 || duprows) && (y === 0 || dupcols)) {
                                    tarray[col_y + y][row_x + x] = content
                                } else {
                                    tarray[col_y + y][row_x + x] = ""
                                }
                            }
                        }
                        col_y += 1
                    });
                    row_x += 1
                });
                tarray = tarray[0].map((col, c) => tarray.map((row, r) => tarray[r][c]))
                var headers = tarray[0]
                var FormattedTable = tarray.slice(1).reduce(function (accum_i, curr_item, curr_index){
                    accum_i.push(curr_item.reduce(function (accum_j, curr_e, curr_i){
                        accum_j[headers[curr_i]] = curr_e
                        return accum_j
                    }, {}))
                    return accum_i
                }, [])
                tables.push(FormattedTable)
            });
            resolve(tables)
        });
    });
}