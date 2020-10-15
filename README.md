# Gasifier-Visualization-App

In order to allow efficient, real time, monitoring of the
gasifier’s operation a visualization tool was developed.
Gasification is multi variable process with many parameters
that need to be monitored and optimized. As so the need arises
for a visualization capable of concurrently displaying these
parameters. Such application should allow quick inferences
about the gasifiers’s current state whilst providing a way of
analysing the overall gasification run and the relation between
its different parameters.

A. Implementation

The software was implemented using JavaScript, more
specifically the d3.js library. This is a tool that allows the
creation of dynamic visualizations featuring a broad array of
personalizing options. It is compatible with all recent
browsers and has the advantage of supporting large data sets.
Its main disadvantage is not having pre constructed
visualizations although a large quantity of examples is
available online. The gasifiers’ illustration was developed
externally using the Inkscape software [27]. This software is
a high-level tool that supports the editing of SVG (Scalable
Vector Graphics) files. It was used to divide a schematic of
the gasifier into several, strictly labeled, SVG elements,
pertaining the different sensor zones, facilitating their post
processing in the tool’s scope. The real time updating of the
data displayed is carried out by simply reloading the data set
at specified time intervals. The complexity and size expected
for the data sets did not justify bolder approaches. The path
of the data is described by the flowchart in figure 6. After the
data from the sensors is read and converted to the appropriate
units, data from all sensors is appended to a string, separated
by commas. The formed message is then sent through one of
the microcontroller’s UART. This latter procedure is
repeated at every sampling time, at a bare minimum. From
the laptop’s perspective, a python script periodically checks
the chosen serial port to read the sent message. The message
is then appended to a csv (Comma-separated values) file
where the data is stored. Finally, the software loads the data
set at specific instants, updating the visualization. As a batch
gasification run may take a couple of hours, delays between
transmissions should not be cumbersome to the user.


![DataPathFlowchart](https://user-images.githubusercontent.com/40301612/96045134-714a9400-0e69-11eb-92b9-a41054494905.png)



B. Solution

The solution developed, shown below, consists of a
dashboard containing an illustration of the gasifier, delimited
by the areas monitored by each temperature sensor, three
sectors displaying concrete values of the ongoing gasifier
operation, and a customizable scatter plot of the evolution
with time for the different quantities. The gasifier illustration
is used two purposes. The first is to allow overall
determination of the gasifier’s stability. When a gasifier
reaches a stable sate of operation a gradient of temperature
should be observable with the temperature monotonously
rising when going from the pyrolysis zone into the
combustion zone and then decreasing when nearing the
reduction zone.


![app (1)](https://user-images.githubusercontent.com/40301612/96045127-70196700-0e69-11eb-9774-7bda930b708f.PNG)

The tool magnifies this gradient by coloring the areas
pertinent to each temperature sensor with a color intensity
computed with a color scale.
The second purpose of this illustration is to act as a
control panel of the data in the scatter plot as brushing is
employed by clicking on a sensor respective zone to select
the data displayed on the scatterplot. Despite of the ability of
the chosen visualization to providing a rapid overview of the
system’s state, color is not reliable in quantifying value [28].
Because of this, the temperature distribution is also exposed
in a bar chart. This approach makes it simpler to visualize the
gradient of temperature along the height of the gasifier. The
bars associated with pressure were separated from the rest as,
unlike in the temperature case, there is no value in the
sequentially of the bars. The parameter evolution sector
promotes the visualization of the system’s properties with
respect to time. Its contents can be easily toggled on or off,
either by clicking on the picture, or by using conveniently
placed buttons. This allows the analysis of a single parameter,
or the concurrent analysis of the selected parameters,
permitting the study of the relation between them. Alongside
the buttons, the current values of different parameters are
displayed. The idea is that after the initial set up, for a normal
gasification run, no further user input should be required. In
case the user wants to explore the ongoing run, or previously
existing data, updates can be disabled, enabling the brushing
functionality of the scatter plot, shown below.
Using this, the user may select a time lapse. The whole
visualization will then be updated to show the average values
in the selected window.

![brushing](https://user-images.githubusercontent.com/40301612/96045420-d43c2b00-0e69-11eb-8847-325bae7fa6b7.png)
