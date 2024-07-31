import React, { useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Button
} from "@nextui-org/react";
import { capitalize } from "../utils/columnsData";
import { EditIcon } from "./icons/EditIcon";
import { EyeIcon } from "./icons/EyeIcon";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { SearchIcon } from "./icons/SearchIcon";
import Modal1 from "./Modal1";

const NextUITable = ({
    columns,
    rows,
    buttons: Buttons,
    initialColumns,
    statusOptions,
    statusColorMap,
    searchKeys,
    actions: Actions,
    statusOrType
}) => {

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(initialColumns));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "codigo",
        direction: "descending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredRows = [...rows];

        if (sortDescriptor) {
            const { column, direction } = sortDescriptor;
            filteredRows.sort((a, b) => {
                if (a[column] < b[column]) return direction === 'ascending' ? -1 : 1;
                if (a[column] > b[column]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        if (hasSearchFilter) {
            filteredRows = filteredRows.filter((item) =>
                searchKeys.some((key) =>
                    String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
                )
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredRows = filteredRows.filter((item) =>
                Array.from(statusFilter).includes(item[statusOrType])
            );
        }

        return filteredRows;
    }, [rows, filterValue, statusFilter, searchKeys, sortDescriptor]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    useEffect(() => {
        setPage(1)
    }, [sortDescriptor])

    const formatDateTime = (cellValue) => {
        const dateObj = new Date(cellValue);       

        const formattedDate = dateObj.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formato HH:MM

        return { date: formattedDate, time: formattedTime };
    };

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "nombre":
                return (
                    <div className="w-full flex items-center">
                        <User
                            /* avatarProps={{ radius: "lg", src: user.avatar }} */
                            description={item.correo}
                            name={capitalize(cellValue)}
                        >
                            {item.correo}
                        </User>
                    </div>
                );
            case "usuario_manager":
                return (
                    <div className="w-full flex items-center">
                        <User
                            /* avatarProps={{ radius: "lg", src: user.avatar }} */
                            description={item.correo_manager}
                            name={capitalize(cellValue)}
                        >
                            {item.correo_manager}
                        </User>
                    </div>
                );
            case "usuario_receiving":
                return (
                    <div className="w-full flex items-center">
                        <User
                            /* avatarProps={{ radius: "lg", src: user.avatar }} */
                            description={item.correo_receiving}
                            name={capitalize(cellValue)}
                        >
                            {item.correo_receiving}
                        </User>
                    </div>
                );
            case "usuario_returning":
                return (
                    <div className="w-full flex items-center">
                        <User
                            /* avatarProps={{ radius: "lg", src: user.avatar }} */
                            description={item.correo_returning}
                            name={capitalize(cellValue)}
                        >
                            {item.correo_returning}
                        </User>
                    </div>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{item.position}</p>
                    </div>
                );
            case "tipo":
                return (
                    <div className="flex justify-center items-center w-full">
                        <Chip className="capitalize" classNames={{
                            content: "w-[60px]"
                        }} color={statusColorMap[item.tipo]} size="sm" variant="flat">
                            {cellValue}
                        </Chip>
                    </div>
                );
            case "status":
                return (
                    cellValue ? (
                        <div className="flex justify-center items-center w-full">
                            < Chip
                                className="capitalize"
                                color={statusColorMap[item.status]}
                                classNames={{
                                    content: "w-[80px] text-center"
                                }}
                                size="sm" variant="flat"
                            >
                                {cellValue == "0" ? "Inactivo" : cellValue == "1" ? "Activo" : cellValue}
                            </Chip >
                        </div>) : (
                        <div className="flex justify-center items-center w-full">---------</div>
                    ));
            case "actions":
                return (
                    <div className="flex justify-center items-center">
                        <Actions codigo={item}></Actions>
                    </div>
                );
            case "codigo":
                return (
                    <div className="flex flex-col w-full">
                        <p className="text-bold text-sm capitalize text-center">{cellValue}</p>
                    </div>
                )
            case "actionElement":
                return (
                    <div className="flex flex-col w-full">
                        <Actions item={item} />
                    </div>
                )
            case "fecha":
                let formattedDate = "";
                let formattedTime = "";

                if (cellValue) {
                    const { date, time } = formatDateTime(cellValue);
                    formattedDate = date;
                    formattedTime = time;
                }
                return (
                    <div className="flex flex-col w-ful">
                        <div className="text-[14px]">{formattedDate}</div>
                        <div className="text-[10px] text-gray-600">{formattedTime}</div>
                    </div>
                )
            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Buscar por..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        variant="bordered"
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown classNames={{
                            content: 'border border-green-200'
                        }}>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="bordered"
                                    color="success"
                                >
                                    {statusOrType == 'tipo' ? 'Tipo' : 'Estado'}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        color="success"
                                        variant="bordered"
                                    >
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown classNames={{
                            content: 'border border-blue-200'
                        }}>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="bordered"
                                    color="primary"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                        variant="bordered"
                                        color="primary"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Buttons></Buttons>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {filteredItems.length} items</span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        rows.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {(rowsPerPage * page) - (rowsPerPage - 1)} - {page === pages ? filteredItems.length : page * rowsPerPage} of {filteredItems.length} items
                </span>


                <div className="flex w-[70%] justify-end gap-5">
                    <Pagination
                        disableCursorAnimation={false}
                        disableAnimation={false}
                        isCompact
                        showControls
                        /* classNames={{
                            cursor: "bg-foreground text-background",
                        }} */
                        color="primary"
                        size="sm"
                        page={page}
                        total={pages}
                        variant="light"
                        onChange={setPage}
                        classNames={{
                            wrapper: "gap-0 overflow-visible h-8 rounded-full bg-gray-800 text-white",
                            item: "w-8 h-8 text-small text-white bg-gray-800",
                            cursor:
                                "bg-red-500 shadow-lg dark:from-default-300 dark:to-default-100 text-white font-bold ",
                        }}
                    />
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Hola mundo"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "h-[400px] min-w-[450px] overflow-y-auto overflow-x-hidden hidden-scrollbar",
                th: "bg-gray-800 text-white",
                td: "group-data-[first=true]:first:before:rounded-none group-data-[first=true]:last:before:rounded-none group-data-[middle=true]:before:rounded-none group-data-[last=true]:first:before:rounded-none group-data-[last=true]:last:before:rounded-none",
                tr: "shadow-none"

            }}
            selectedKeys={selectedKeys}

            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            isCompact
            color={"success"}
        >
            <TableHeader columns={headerColumns}
                classNames={{

                }}
            >
                {(column) => (
                    <TableColumn
                        className="text-center"
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : column.uid === "tipo" ? "center" : "start"}
                        width={column.uid === "codigo" ? '20px' : ''}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={items} emptyContent={"No hay movimientos"}>
                {(item) => (
                    <TableRow key={item.codigo}>
                        {(columnKey) => <TableCell className="text-center">{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table >
    )
}

export default NextUITable;