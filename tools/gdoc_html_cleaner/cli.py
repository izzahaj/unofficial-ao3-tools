import os
import tkinter as tk
from tkinter import filedialog, messagebox
import cleaner
import utils


def select_gdoc_html_file() -> tuple[str, str]:
    """
    Prompts the user to select a Google Docs-exported HTML file.

    Returns:
        Tuple of (file path, file content) if valid file is selected,
        otherwise ("", "") if cancelled.
    """
    while True:
        print("Please select an HTML file exported from Google Docs.")

        file_path = filedialog.askopenfilename(
            title="Select an HTML file exported from Google Docs",
            filetypes=[("HTML files", "*.html")],
        )

        if not file_path:
            print("No file selected.")
            return "", ""

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                html_content = f.read()
        except PermissionError:
            print("You do not have permission to read the selected file.")
            messagebox.showerror(
                "Permission Denied",
                f"Permission denied when trying to read {file_path}. Please try again.",
            )
            continue
        except IOError:
            print("Something went wrong when opening the file. Please try again.")
            messagebox.showerror(
                "File Error",
                "Something went wrong when opening the file. Please try again.",
            )
            continue

        if utils.is_gdoc_html(html_content):
            return file_path, html_content
        else:
            print(
                "The selected file does not appear to be an HTML file exported from Google Docs. Please try again."
            )
            messagebox.showerror(
                "Invalid File",
                "The selected file doesn't appear to be exported from Google Docs. Please try again.",
            )


def save_cleaned_html(content: str, default_dir: str) -> None:
    """
    Prompts the user to choose where to save the cleaned HTML.

    Args:
        content: The cleaned HTML content.
        default_dir: Default directory or file path for the save dialog.
    """
    while True:
        default_file_name = (
            f"{os.path.splitext(os.path.basename(default_dir))[0]}_cleaned.html"
        )

        print("Please choose a location to save the cleaned HTML file.")

        output_path = filedialog.asksaveasfilename(
            initialdir=default_dir,
            initialfile=default_file_name,
            title="Save Cleaned HTML As",
            defaultextension=".html",
            filetypes=[("HTML files", "*.html")],
        )

        if not output_path:
            print("No save location selected.")
            return

        try:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(content)

            print(f"Cleaned HTML written to: {output_path}")
            return
        except PermissionError:
            print("You do not have permission to save the selected file.")
            messagebox.showerror(
                "Permission Denied",
                f"Permission denied when trying to save to {output_path}. Please try again.",
            )
        except IOError:
            print("Something went wrong when saving the file. Please try again.")
            messagebox.showerror(
                "File Error",
                "Something went wrong when saving the file. Please try again.",
            )


def main():
    """
    Entry point for the Google Docs HTML Cleaner tool.
    """
    print("Welcome to the Google Docs HTML Cleaner!")

    root = tk.Tk()
    root.withdraw()

    html_path, html_content = select_gdoc_html_file()

    if not html_path:
        print("Goodbye!")
        return

    print("Cleaning HTML file...")
    cleaned_html = cleaner.clean(html_content)
    print("Done!")

    save_cleaned_html(cleaned_html, default_dir=html_path)

    print("Goodbye!")


if __name__ == "__main__":
    main()
