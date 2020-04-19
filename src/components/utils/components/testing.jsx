import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableBody,
  IconButton,
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
} from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

const grid = 8;

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const columnData = [
  {
    id: 1,
    title: "First column",
    itemIds: [1, 2, 3],
  },
  {
    id: 2,
    title: "Second column",
    itemIds: [4, 6],
  },
];

const itemData = [
  {
    id: 1,
    name: "first item",
  },
  {
    id: 2,
    name: "second item",
  },
  {
    id: 3,
    name: "third item",
  },
  {
    id: 4,
    name: "fourth item",
  },
  {
    id: 6,
    name: "sixth item",
  },
];

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

const Testing = () => {
  const [items, setItems] = useState(itemData);
  const [columns, setColumns] = useState(columnData);

  const onDragEnd = (result) => {
    // dropped outside the list
    let data = [...columns];
    console.log(result);
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }
    const sourceId = source.index;
    const destinationId = destination.index;

    // const destinationIndex = _.findIndex(data, function(e) {
    //   return destinationId === e.id;
    // });

    // const sourceIndex = _.findIndex(data, function(e) {
    //   return sourceId === e.id;
    // });
    if (source.droppableId === destination.droppableId) {
      /* reorder to */
      const columnId = parseInt(source.droppableId[source.droppableId.length - 1], 10);
      const columnIndex = _.findIndex(data, function (e) {
        return e.id === columnId;
      });

      let { itemIds } = data[columnIndex];
      const destinationIndex = itemIds.indexOf(destinationId);
      const sourceIndex = itemIds.indexOf(sourceId);

      data[columnIndex].itemIds = reorder(itemIds, sourceIndex, destinationIndex);
      console.log(data);
    } else {
      /* column to column
        delete on source column,
        insert in new column

      */
      const sourceColumnId = parseInt(source.droppableId[source.droppableId.length - 1], 10);
      const destinationColumnId = parseInt(
        destination.droppableId[destination.droppableId.length - 1],
        10
      );
      const sourceColIndex = _.findIndex(data, function (e) {
        return e.id === sourceColumnId;
      });
      const destinationColIndex = _.findIndex(data, function (e) {
        return e.id === destinationColumnId;
      });
      let { itemIds } = data[sourceColIndex];
      const sourceItemIndex = itemIds.indexOf(sourceId);
      data[sourceColIndex].itemIds.splice(sourceItemIndex, 1);
      itemIds = data[destinationColIndex].itemIds;
      const destinationItemIndex = itemIds.indexOf(destinationId);
      data[destinationColIndex].itemIds.splice(destinationItemIndex, 0, sourceId);
    }

    setColumns(data);
  };
  const renderItem = (itemId) => {
    const index = _.findIndex(items, function (e) {
      return e.id === itemId;
    });
    const item = items[index];
    return (
      <Draggable key={`key-${item.id}`} draggableId={`${item.id}`} index={item.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          >
            {item.name}
          </div>
        )}
      </Draggable>
    );
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container>
        {columns.map((column) => {
          return (
            <Grid item xs={3}>
              <Typography align="left">{column.title}</Typography>
              <Droppable droppableId={`column-${column.id}`}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {column.itemIds.map((item) => renderItem(item))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
          );
        })}
      </Grid>
    </DragDropContext>
  );
};

export default Testing;
