Attribute VB_Name = "Program"
Option Explicit

Public Sub Main()
    Dim greeter As Greeter
    Set greeter = New Greeter
    Dim i As Long
    For i = 1 To 3
        Debug.Print greeter.Greet("World", i)
    Next
End Sub
