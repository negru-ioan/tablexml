<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="style.css" />
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <script src="index.js"></script>
                <title>Table</title>
            </head>
            <body>
                <div class="main">
                    <nav>
                        <div>
                            <button id="addButton" class="btn" onclick="">Add user</button>
                        </div>

                        <div class="addUserContainer none">
                            <form id="addUserForm" class="flex" style="align-items: end">
                                <div>
                                    <label for="id-searchInput">Id:</label>
                                    <input type="text" placeholder="Id" id="id" required="true" />
                                </div>
                                <div>
                                    <label for="id-searchInput">First Name:</label>
                                    <input type="firstName" placeholder="John" id="firstName" required="true" />
                                </div>
                                <div>
                                    <label for="id-searchInput">Last Name:</label>
                                    <input type="lastName" placeholder="Doe" id="lastName" required="true" />
                                </div>
                                <div>
                                    <label for="id-searchInput">Email:</label>
                                    <input type="email" placeholder="johndoe@gmail.com" id="email" required="true" />
                                </div>
                                <div>
                                    <label for="id-searchInput">Phone:</label>
                                    <input type="phone" placeholder="0743450724" id="phone" required="true" />
                                </div>
                                <div>
                                    <label for="id-searchInput">Address:</label>
                                    <input type="address" placeholder="0743450724" id="address" required="true" />
                                </div>
                                <div>
                                    <label for="id-searchInput">Description:</label>
                                    <input type="text" placeholder="0743450724" id="description" required="true" />
                                </div>

                                <button type="submit" class="btn">Add</button>

                            </form>
                        </div>

                        <form id="searchForm">
                            <div class="">
                                <label for="id-searchInput">Search:</label>
                                <input type="text" placeholder="search" id="searchInput" required="true" />
                            </div>
                            <div>
                                <label for="pet-select">Choose a option:</label>

                                <select name="options" id="option-select">
                                    <option value="">
                                        --Please choose an option--
                                    </option>
                                    <option value="id">Id</option>
                                    <option value="firstName">First Name</option>
                                    <option value="lastName">Last Name</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="address">Address</option>
                                    <option value="description">Description</option>
                                </select>
                            </div>
                            <button type="submit" class="btn">Search</button>
                        </form>
                    </nav>

                    <table>
                        <thead>
                            <tr>
                                <th data-orderDirection="1" data-prop="id">
                                    Id ↑↓
                                </th>
                                <th data-orderDirection="1" data-prop="firstName">
                                    First Name ↑↓
                                </th>
                                <th data-orderDirection="1" data-prop="lastName">
                                    Last Name ↑↓
                                </th>
                                <th data-orderDirection="1" data-prop="email">
                                    Email ↑↓
                                </th>
                                <th data-orderDirection="1" data-prop="phone">
                                    Phone ↑↓
                                </th>
                                <th data-orderDirection="1" data-prop="address">
                                    Address ↑↓
                                </th>
                                <th data-orderDirection="1" data-prop="description">
                                    Description ↑↓
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <xsl:for-each select="/root/row">
                                <tr>
                                    <td>
                                        <xsl:value-of select="id" />
                                    </td>
                                    <td>
                                        <xsl:value-of select="firstName" />
                                    </td>
                                    <td>
                                        <xsl:value-of select="lastName" />
                                    </td>
                                    <td>
                                        <xsl:value-of select="email" />
                                    </td>
                                    <td>
                                        <xsl:value-of select="phone" />
                                    </td>
                                    <td>
                                        <span>
                                            <xsl:value-of select="address/streetAddress" />
                                        </span>
                                        <span>
                                            <xsl:value-of select="address/city" />
                                        </span>
                                        <span>
                                            <xsl:value-of select="address/state" />
                                        </span>
                                        <span>
                                            <xsl:value-of select="address/zip" />
                                        </span>
                                    </td>
                                    <td>
                                        <xsl:value-of select="description" />
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>

                    <div id="pagination-container">
                        <div id="pagination">
                            <button class="change-page">
                                &lt;&lt; Back
                            </button>
                            <div id="paginationBtns">
                            </div>
                            <button class="change-page">Next &gt;&gt;</button>
                        </div>
                    </div>

                </div>
                <div id="table-container">

                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>